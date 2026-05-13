from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse, Response
import shutil
import os
import uuid
from converter import DocumentConverter
from PIL import Image
from pathlib import Path
import time
import io

app = FastAPI()
converter = DocumentConverter()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/convert/pdf-to-images")
async def pdf_to_images_api(files: list[UploadFile] = File(...), dpi: int = Form(300)):
    session_id = str(uuid.uuid4())
    task_dir = os.path.join(UPLOAD_DIR, session_id)
    os.makedirs(task_dir)
    
    flat_images_folder = os.path.join(task_dir, "all_images")
    os.makedirs(flat_images_folder)
    
    try:
        for file in files:
            pdf_path = os.path.join(task_dir, file.filename)
            with open(pdf_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            pdf_name = os.path.splitext(file.filename)[0]
            
            temp_pdf_folder = os.path.join(task_dir, "temp_convert")
            if not os.path.exists(temp_pdf_folder):
                os.makedirs(temp_pdf_folder)
                
            pages = converter.pdf_to_images(pdf_path, temp_pdf_folder, dpi=dpi)
            
            if pages:
                for i, page_path in enumerate(pages):
                    new_filename = f"{pdf_name}_page_{i+1}.png"
                    final_path = os.path.join(flat_images_folder, new_filename)
                    shutil.move(page_path, final_path)
            
            shutil.rmtree(temp_pdf_folder)

        zip_base_path = os.path.join(task_dir, "converted_images")
        shutil.make_archive(zip_base_path, 'zip', flat_images_folder)
        
        return FileResponse(
            Path(f"{zip_base_path}.zip"), 
            media_type='application/zip', 
            filename="converted_images.zip"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF to Image conversion failed: {str(e)}")

@app.post("/convert/images-to-pdf")
async def images_to_pdf_api(
    files: list[UploadFile] = File(...), 
    merge: str = Form("false"), 
    quality: str = Form("80")
):
    is_merge = str(merge).lower() == "true"
    quality_int = int(quality)
    processed_images = []

    try:
        # 1. Siguraduhin na ang files ay naka-sort para hindi mag-error ang sequence
        sorted_files = sorted(files, key=lambda x: x.filename)

        for file in sorted_files:
            # Basahin ang file content nang buo bago ipasa sa Image.open
            file_content = await file.read()
            if not file_content:
                continue
            
            img = Image.open(io.BytesIO(file_content))
            
            # Napakahalaga: Convert to RGB para sa PDF compatibility
            if img.mode != "RGB":
                img = img.convert("RGB")
            
            # I-compress ang bawat image bago i-store sa list
            img_io = io.BytesIO()
            img.save(img_io, format="JPEG", quality=quality_int, optimize=True)
            img_io.seek(0)
            
            processed_images.append(Image.open(img_io))

        if not processed_images:
            raise HTTPException(status_code=400, detail="no valid images uploaded")

        # 2. PDF MERGE LOGIC (Dito madalas mag-corrupt kung marami)
        output_buffer = io.BytesIO()
        
        if is_merge:
            # I-save ang lahat sa isang buffer
            processed_images[0].save(
                output_buffer,
                format="PDF",
                save_all=True,
                append_images=processed_images[1:] if len(processed_images) > 1 else [],
                resolution=100.0
            )
            filename = "merged_files.pdf"
            content_type = "application/pdf"
        else:
            # Dito naman ang logic kung Individual PDFs (i-zip natin)
            # Gumamit ng temp directory para hindi mag-crash ang memory
            import tempfile
            import zipfile
            
            with tempfile.TemporaryDirectory() as tmpdir:
                zip_path = os.path.join(tmpdir, "converted.zip")
                with zipfile.ZipFile(zip_path, 'w') as zipf:
                    for i, img in enumerate(processed_images):
                        pdf_path = os.path.join(tmpdir, f"file_{i+1}.pdf")
                        img.save(pdf_path, "PDF")
                        zipf.write(pdf_path, arcname=f"image_to_pdf_{i+1}.pdf")
                
                with open(zip_path, "rb") as f:
                    output_buffer.write(f.read())
            
            filename = "converted_files.zip"
            content_type = "application/zip"

        # 3. SIGURADUHING NASA ZERO ANG SEEK NG BUFFER
        pdf_data = output_buffer.getvalue()
        output_buffer.close()

        if not pdf_data:
            raise Exception("no data generated")

        return Response(
            content=pdf_data,
            media_type=content_type,
            headers={
                "Content-Disposition": f"attachment; filename={filename}",
                "Content-Length": str(len(pdf_data)),
                "Access-Control-Expose-Headers": "Content-Disposition"
            }
        )

    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return Response(content=str(e), status_code=500)
    finally:
        # Linisin ang lahat ng images sa memory
        for im in processed_images:
            im.close()

@app.post("/convert/merge-pdfs")
async def merge_pdfs_api(
    files: list[UploadFile] = File(...),
    quality: int = Form(80) # ✅ FEATURE: Support din dito ang compression
):
    session_id = str(uuid.uuid4())
    task_dir = os.path.join(UPLOAD_DIR, session_id)
    os.makedirs(task_dir, exist_ok=True)
    
    try:
        from pdf2image import convert_from_path
        all_images = []
        pdf_paths = []
        
        for file in files:
            file_path = os.path.join(task_dir, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            pdf_paths.append(file_path)
        
        for pdf_path in pdf_paths:
            images = convert_from_path(pdf_path, dpi=150, poppler_path=converter.poppler_path)
            for img in images:
                if img.mode != "RGB":
                    img = img.convert("RGB")
                all_images.append(img)
        
        if not all_images:
            raise HTTPException(status_code=400, detail="Failed to convert PDFs")
        
        pdf_bytes = io.BytesIO()
        all_images[0].save(
            pdf_bytes,
            "PDF",
            save_all=True,
            append_images=all_images[1:] if len(all_images) > 1 else [],
            resolution=72.0,
            quality=quality # ✅ Dynamic quality
        )
        
        for img in all_images:
            img.close()
        
        pdf_bytes.seek(0)
        return Response(
            content=pdf_bytes.getvalue(),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=merged_document.pdf"}
        )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok"}