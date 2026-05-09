import os
import platform
from PIL import Image
from pdf2image import convert_from_path
from PyPDF2 import PdfMerger  # ✅ Using PyPDF2 (more stable)

class DocumentConverter:
    def __init__(self):
        # I-check kung Windows o Linux ang environment
        if platform.system() == "Windows":
            # Path para sa local development mo sa Windows
            self.poppler_path = r'C:\poppler-26.02.0\Library\bin'
        else:
            # Sa Render/Linux, hindi kailangan ng path dahil installed ito sa system via Docker
            self.poppler_path = None 

    def pdf_to_images(self, pdf_path, output_folder, dpi=300):
        """
        Convert bawat pahina ng PDF tungo sa PNG images.
        """
        try:
            # Gumawa ng output folder kung wala pa
            if not os.path.exists(output_folder):
                os.makedirs(output_folder)

            print(f"Sinisimulan ang conversion ng: {pdf_path}")
            
            # Gagamitin ang self.poppler_path (na nagiging None kapag nasa Linux/Render)
            images = convert_from_path(
                pdf_path, 
                dpi=dpi, 
                poppler_path=self.poppler_path
            )

            saved_files = []
            for i, image in enumerate(images):
                filename = f"page_{i + 1}.png"
                path = os.path.join(output_folder, filename)
                image.save(path, "PNG")
                saved_files.append(path)
                print(f"Saved: {path}")
            
            return saved_files
            
        except Exception as e:
            print(f"Error sa PDF to Image conversion: {e}")
            return None

    def images_to_pdf(self, image_folder, output_pdf_path):
        """
        Pagsama-samahin ang lahat ng images sa isang folder tungo sa isang PDF.
        """
        try:
            # Kunin ang lahat ng files na JPG o PNG
            valid_extensions = ('.jpg', '.jpeg', '.png')
            files = [
                f for f in os.listdir(image_folder) 
                if f.lower().endswith(valid_extensions)
            ]
            
            # I-sort para hindi magkagulo ang pagkakasunod-sunod ng pages
            files.sort()

            if not files:
                print("Walang nahanap na images sa folder.")
                return False

            image_objects = []
            for filename in files:
                img_path = os.path.join(image_folder, filename)
                img = Image.open(img_path)
                
                # IMPORTANT: I-convert sa RGB dahil ang PDF ay hindi tumatanggap ng RGBA (transparency)
                rgb_img = img.convert('RGB')
                image_objects.append(rgb_img)

            if image_objects:
                # FIX: Gumamit ng 'with open' para siguradong selyado ang file bago ito basahin ng API
                with open(output_pdf_path, "wb") as f:
                    image_objects[0].save(
                        f, 
                        format="PDF",
                        save_all=True, 
                        append_images=image_objects[1:]
                    )
                print(f"PDF Successfully created: {output_pdf_path}")
                return True
                
        except Exception as e:
            print(f"Error sa Image to PDF conversion: {e}")
            return False

    def merge_pdfs(self, pdf_paths, output_path):
        """
        Pagsasama-samahin ang listahan ng PDF paths tungo sa iisang file.
        ✅ Using PyPDF2 (more stable for merging)
        """
        try:
            # ✅ Use PdfMerger from PyPDF2
            merger = PdfMerger()
            
            for pdf in pdf_paths:
                print(f"Merging: {pdf}")
                merger.append(pdf)
            
            # ✅ Write sa file gamit ang 'with' statement
            with open(output_path, "wb") as f:
                merger.write(f)
            
            # ✅ CRITICAL: Close the merger to free resources
            merger.close()
            
            print(f"Successfully merged into: {output_path}")
            return True
            
        except Exception as e:
            print(f"Error sa PDF merging: {e}")
            import traceback
            traceback.print_exc()
            return False

# Para sa testing (Standalone)
if __name__ == "__main__":
    conv = DocumentConverter()