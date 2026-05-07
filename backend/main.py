from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import shutil
import os
import uuid
from converter import DocumentConverter
from PIL import Image

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
    
    # Dito ilalagay lahat ng images nang sabay-sabay (Flat Folder)
    flat_images_folder = os.path.join(task_dir, "all_images")
    os.makedirs(flat_images_folder)
    
    try:
        for file in files:
            # 1. I-save muna ang PDF
            pdf_path = os.path.join(task_dir, file.filename)
            with open(pdf_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            # 2. I-convert ang PDF. 
            # Imbis na folder, gagamit tayo ng prefix para hindi mag-overwrite ang files
            pdf_name = os.path.splitext(file.filename)[0]
            
            # Temporary folder para sa conversion ng isang PDF
            temp_pdf_folder = os.path.join(task_dir, "temp_convert")
            if not os.path.exists(temp_pdf_folder):
                os.makedirs(temp_pdf_folder)
                
            pages = converter.pdf_to_images(pdf_path, temp_pdf_folder, dpi=dpi)
            
            if pages:
                for i, page_path in enumerate(pages):
                    # I-rename at ilipat sa flat folder
                    # Format: PangalanNgPDF_page1.png
                    new_filename = f"{pdf_name}_page_{i+1}.png"
                    final_path = os.path.join(flat_images_folder, new_filename)
                    shutil.move(page_path, final_path)
            
            # Linisin ang temp folder para sa susunod na PDF
            shutil.rmtree(temp_pdf_folder)

        # 3. I-zip ang flat folder
        zip_base_path = os.path.join(task_dir, "converted_images")
        shutil.make_archive(zip_base_path, 'zip', flat_images_folder)
        
        return FileResponse(
            f"{zip_base_path}.zip", 
            media_type='application/zip', 
            filename="converted_images.zip"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF to Image conversion failed: {str(e)}")

@app.post("/convert/images-to-pdf")
async def images_to_pdf_api(files: list[UploadFile] = File(...)):
    session_id = str(uuid.uuid4())
    task_dir = os.path.join(UPLOAD_DIR, session_id)
    os.makedirs(task_dir)
    
    pdf_output_folder = os.path.join(task_dir, "individual_pdfs")
    os.makedirs(pdf_output_folder)
    
    try:
        for file in files:
            temp_image_path = os.path.join(task_dir, file.filename)
            with open(temp_image_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            
            pdf_filename = os.path.splitext(file.filename)[0] + ".pdf"
            pdf_path = os.path.join(pdf_output_folder, pdf_filename)
            
            with Image.open(temp_image_path) as img:
                # FIX: Siguraduhing gagawing RGB at hahawakan ang transparency
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGBA")
                    # Gagawa ng white background para sa mga transparent images
                    new_img = Image.new("RGB", img.size, (255, 255, 255))
                    new_img.paste(img, mask=img.split()[3]) # paste gamit ang alpha channel
                    new_img.save(pdf_path, "PDF", resolution=100.0)
                else:
                    rgb_img = img.convert('RGB')
                    rgb_img.save(pdf_path, "PDF", resolution=100.0)
            
            os.remove(temp_image_path)

        zip_base_name = os.path.join(task_dir, "converted_pdfs")
        shutil.make_archive(zip_base_name, 'zip', pdf_output_folder)
        
        final_zip_path = f"{zip_base_name}.zip"
        return FileResponse(final_zip_path, media_type='application/zip', filename="converted_pdfs.zip")

    except Exception as e:
        print(f"BACKEND ERROR: {str(e)}") # Lalabas ito sa terminal mo
        raise HTTPException(status_code=500, detail=str(e))

# --- BAGONG FEATURE: MERGE PDFS ---
@app.post("/convert/merge-pdfs")
async def merge_pdfs_api(files: list[UploadFile] = File(...)):
    session_id = str(uuid.uuid4())
    task_dir = os.path.join(UPLOAD_DIR, session_id)
    os.makedirs(task_dir)
    
    try:
        pdf_paths = []
        for file in files:
            file_path = os.path.join(task_dir, file.filename)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            pdf_paths.append(file_path)
        
        output_pdf_path = os.path.join(task_dir, "merged_result.pdf")
        
        # Tinatawag ang merge_pdfs function mula sa converter.py
        success = converter.merge_pdfs(pdf_paths, output_pdf_path)
        
        if success:
            return FileResponse(
                output_pdf_path, 
                media_type='application/pdf', 
                filename="merged_document.pdf"
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to merge PDFs")
            
    except Exception as e:
        print(f"MERGE ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))