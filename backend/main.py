from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import shutil
import os
import uuid
from converter import DocumentConverter
from PIL import Image
from pathlib import Path
import time

app = FastAPI()
converter = DocumentConverter()

# Payagan ang Next.js na maka-connect
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
async def images_to_pdf_api(files: list[UploadFile] = File(...), merge: bool = Form(False)):
    session_id = str(uuid.uuid4())
    task_dir = os.path.join(UPLOAD_DIR, session_id)
    os.makedirs(task_dir)
    
    try:
        processed_images = []
        sorted_files = sorted(files, key=lambda x: x.filename)

        print(f"[IMG2PDF] Processing {len(sorted_files)} files, merge={merge}")

        for file in sorted_files:
            if not file.content_type.startswith('image/'):
                print(f"[IMG2PDF] Skipping non-image: {file.filename}")
                continue
            
            temp_path = os.path.join(task_dir, file.filename)
            with open(temp_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            try:
                img = Image.open(temp_path)
                if img.mode != "RGB":
                    img = img.convert("RGB")
                img.load() 
                processed_images.append(img)
                print(f"[IMG2PDF] Processed: {file.filename}")
            except Exception as img_error:
                print(f"[IMG2PDF] Error: {file.filename}: {img_error}")
                continue

        if not processed_images:
            raise HTTPException(status_code=400, detail="No valid image files found")

        if merge:
            output_pdf = os.path.join(task_dir, "merged_images.pdf")
            
            print(f"[IMG2PDF] Merging {len(processed_images)} images to PDF...")
            
            # ✅ FIX: Remove invalid 'optimize' parameter
            # PIL Image.save() for PDF doesn't support 'optimize' parameter
            processed_images[0].save(
                output_pdf,
                "PDF", 
                save_all=True, 
                append_images=processed_images[1:] if len(processed_images) > 1 else [],
                resolution=72.0,
                quality=75
            )
            
            # Close all images immediately
            for img in processed_images:
                img.close()
            
            print(f"[IMG2PDF] Saved to temp: {output_pdf}")
            
            # Wait for file system
            time.sleep(0.5)
            
            # Verify file exists and has content
            if not os.path.exists(output_pdf):
                raise HTTPException(status_code=500, detail="PDF creation failed")
            
            file_size = os.path.getsize(output_pdf)
            if file_size == 0:
                raise HTTPException(status_code=500, detail="PDF is empty")
            
            print(f"[IMG2PDF] ✅ PDF created: {file_size} bytes ({file_size/1024/1024:.2f} MB)")
            
            # Return the file
            return FileResponse(
                Path(output_pdf), 
                media_type='application/pdf',
                filename="merged_images.pdf",
                headers={
                    "Content-Disposition": "attachment; filename=merged_images.pdf",
                    "Cache-Control": "no-cache, no-store, must-revalidate"
                }
            )
        else:
            # Individual PDFs
            pdf_output_folder = os.path.join(task_dir, "individual_pdfs")
            os.makedirs(pdf_output_folder)
            for i, img in enumerate(processed_images):
                pdf_path = os.path.join(pdf_output_folder, f"file_{i+1}.pdf")
                # ✅ FIX: Removed 'optimize' parameter
                img.save(pdf_path, "PDF", resolution=72.0, quality=75)
                img.close()
            
            zip_path = os.path.join(task_dir, "converted_pdfs")
            shutil.make_archive(zip_path, 'zip', pdf_output_folder)
            return FileResponse(
                Path(f"{zip_path}.zip"), 
                media_type='application/zip', 
                filename="converted_pdfs.zip"
            )

    except HTTPException:
        raise
    except Exception as e:
        print(f"[IMG2PDF] ❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/convert/merge-pdfs")
async def merge_pdfs_api(files: list[UploadFile] = File(...)):
    """
    Merge multiple PDFs into one
    Strategy: PDF → Images → Single PDF
    """
    session_id = str(uuid.uuid4())
    task_dir = os.path.join(UPLOAD_DIR, session_id)
    os.makedirs(task_dir, exist_ok=True)
    
    try:
        from pdf2image import convert_from_path
        
        all_images = []
        pdf_paths = []
        
        # Step 1: Save and collect all PDFs
        for file in files:
            if not file.content_type == 'application/pdf':
                print(f"[MERGE] Warning: {file.filename} is not PDF")
                continue
            
            file_path = os.path.join(task_dir, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            pdf_paths.append(file_path)
        
        if not pdf_paths:
            raise HTTPException(status_code=400, detail="No valid PDF files found")
        
        print(f"[MERGE] Converting {len(pdf_paths)} PDFs to images...")
        
        # Step 2: Convert each PDF to images
        for pdf_path in pdf_paths:
            print(f"[MERGE] Converting: {pdf_path}")
            try:
                images = convert_from_path(
                    pdf_path, 
                    dpi=150,
                    poppler_path=converter.poppler_path
                )
                
                for img in images:
                    if img.mode != "RGB":
                        img = img.convert("RGB")
                    all_images.append(img)
                    
            except Exception as e:
                print(f"[MERGE] Error: {e}")
                continue
        
        if not all_images:
            raise HTTPException(status_code=400, detail="Failed to convert any PDFs")
        
        # Step 3: Merge all images into single PDF
        output_pdf_path = os.path.join(task_dir, "merged_result.pdf")
        
        print(f"[MERGE] Creating PDF from {len(all_images)} images...")
        
        # ✅ FIX: Removed 'optimize' parameter
        all_images[0].save(
            output_pdf_path,
            "PDF",
            save_all=True,
            append_images=all_images[1:] if len(all_images) > 1 else [],
            resolution=72.0,
            quality=75
        )
        
        # Close all images
        for img in all_images:
            img.close()
        
        time.sleep(0.5)
        
        # Verify file
        if not os.path.exists(output_pdf_path):
            raise HTTPException(status_code=500, detail="PDF creation failed")
        
        file_size = os.path.getsize(output_pdf_path)
        if file_size == 0:
            raise HTTPException(status_code=500, detail="PDF is empty")
        
        print(f"[MERGE] ✅ Success! {file_size} bytes ({file_size/1024/1024:.2f} MB)")
        
        # Return file
        return FileResponse(
            Path(output_pdf_path), 
            media_type='application/pdf',
            filename="merged_document.pdf",
            headers={
                "Content-Disposition": "attachment; filename=merged_document.pdf",
                "Cache-Control": "no-cache, no-store, must-revalidate"
            }
        )
            
    except HTTPException:
        raise
    except Exception as e:
        print(f"[MERGE] ❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok"}