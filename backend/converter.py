import os
from PIL import Image
from pdf2image import convert_from_path
from pypdf import PdfWriter  # Import para sa merging

class DocumentConverter:
    def __init__(self):
        # Dito natin ilalagay ang path ng Poppler bin folder mo
        # Halimbawa: r'C:\poppler\Library\bin'
        self.poppler_path = r'C:\poppler-26.02.0\Library\bin' 

    def pdf_to_images(self, pdf_path, output_folder, dpi=300):
        """
        Convert bawat pahina ng PDF tungo sa PNG images.
        """
        try:
            # Gumawa ng output folder kung wala pa
            if not os.path.exists(output_folder):
                os.makedirs(output_folder)

            print(f"Sinisimulan ang conversion ng: {pdf_path}")
            
            # Ang convert_from_path ang gumagamit sa Poppler
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
                # I-save ang unang image at i-append ang mga susunod
                image_objects[0].save(
                    output_pdf_path, 
                    save_all=True, 
                    append_images=image_objects[1:]
                )
                print(f"PDF Successfully created: {output_pdf_path}")
                return True
                
        except Exception as e:
            print(f"Error sa Image to PDF conversion: {e}")
            return False

    # --- BAGONG FUNCTION PARA SA MERGING ---
    def merge_pdfs(self, pdf_paths, output_path):
        """
        Pagsasama-samahin ang listahan ng PDF paths tungo sa iisang file.
        """
        try:
            merger = PdfWriter()
            
            for pdf in pdf_paths:
                print(f"Merging: {pdf}")
                merger.append(pdf)
            
            merger.write(output_path)
            merger.close()
            print(f"Successfully merged into: {output_path}")
            return True
        except Exception as e:
            print(f"Error sa PDF merging: {e}")
            return False

# Para sa testing (Standalone)
if __name__ == "__main__":
    conv = DocumentConverter()
    # Pwede mo itong i-uncomment para i-test nang direkta sa terminal:
    # conv.pdf_to_images('test.pdf', 'output_images')