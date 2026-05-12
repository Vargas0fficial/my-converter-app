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
    print(f"\n--- NEW REQUEST: {len(files)} files ---")
    processed_images = []
    
    try:
        # 1. Parse Inputs
        is_merge = str(merge).lower() == "true"
        q_val = int(quality)
        print(f"DEBUG: merge={is_merge}, quality={q_val}")

        # 2. Process Images
        for file in files:
            print(f"DEBUG: Processing {file.filename} ({file.content_type})")
            
            # Basahin ang bytes
            img_bytes = await file.read()
            if not img_bytes:
                print(f"DEBUG: Empty bytes for {file.filename}")
                continue
                
            # Buksan sa Pillow
            img = Image.open(io.BytesIO(img_bytes))
            
            # Siguraduhing RGB
            if img.mode != "RGB":
                img = img.convert("RGB")
            
            # Apply quality/compression by saving to a temporary buffer
            tmp_buffer = io.BytesIO()
            img.save(tmp_buffer, format="JPEG", quality=q_val)
            tmp_buffer.seek(0)
            
            # I-reload bilang bagong image object para malinis
            final_img = Image.open(tmp_buffer)
            final_img.load()
            processed_images.append(final_img)

        print(f"DEBUG: Total processed images: {len(processed_images)}")

        if not processed_images:
            return Response(content="No valid images were processed", status_code=400)

        if is_merge:
            # 3. Generate PDF
            pdf_output = io.BytesIO()
            processed_images[0].save(
                pdf_output,
                format="PDF",
                save_all=True,
                append_images=processed_images[1:] if len(processed_images) > 1 else []
            )
            
            final_pdf_data = pdf_output.getvalue()
            pdf_output.close()
            
            # Cleanup
            for im in processed_images:
                im.close()

            print(f"DEBUG: PDF Size: {len(final_pdf_data)} bytes")

            # 4. Return Response
            return Response(
                content=final_pdf_data,
                media_type="application/pdf",
                headers={
                    "Content-Disposition": "attachment; filename=output.pdf",
                    "Content-Length": str(len(final_pdf_data))
                }
            )
        else:
            # Shortcut muna tayo: Kung hindi merge, i-return ang unang image as PDF 
            # para lang ma-test natin kung working ang bytes
            pdf_output = io.BytesIO()
            processed_images[0].save(pdf_output, format="PDF")
            data = pdf_output.getvalue()
            return Response(content=data, media_type="application/pdf")

    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc() # Para makita ang exact line ng error sa terminal
        return Response(content=str(e), status_code=500)

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