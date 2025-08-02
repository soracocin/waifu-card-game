package com.cocin.waifuwar.service;

import com.cocin.waifuwar.config.FileStorageProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;

    @Autowired
    public FileStorageService(FileStorageProperties fileStorageProperties) {
        // Lấy base uploadDir từ config
        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir())
                .toAbsolutePath().normalize();

        try {
            // Tạo thư mục upload nếu chưa tồn tại
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload directory.", ex);
        }
    }

    /**
     * Lưu file vào folder con được chỉ định, trả về đường dẫn URL hoặc path tương ứng
     * @param file MultipartFile upload
     * @param folderName tên thư mục con (vd "cards")
     * @return đường dẫn file đã lưu, ví dụ "/uploads/cards/abc.jpg"
     */
    public String storeFile(MultipartFile file, String folderName) {
        // Chuẩn hóa tên file, tránh mã độc, ký tự lạ
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // Kiểm tra tên file hợp lệ
            if (originalFilename.contains("..")) {
                throw new RuntimeException("Invalid path sequence in filename " + originalFilename);
            }

            // Tạo thư mục con nếu chưa tồn tại
            Path targetDir = this.fileStorageLocation.resolve(folderName).normalize();
            Files.createDirectories(targetDir);

            // Đổi tên file thành tên unique tránh trùng lặp, giữ lại phần mở rộng
            String fileExtension = "";
            int extIndex = originalFilename.lastIndexOf(".");
            if (extIndex > 0) {
                fileExtension = originalFilename.substring(extIndex);
            }
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // Đường dẫn file lưu cuối cùng
            Path targetLocation = targetDir.resolve(uniqueFilename);

            // Copy file lên server
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Trả về URL relative để frontend có thể truy cập, giả sử bạn expose đường dẫn /uploads/
            // Ví dụ, "/uploads/cards/uuid.jpg"
            return "/uploads/" + folderName + "/" + uniqueFilename;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFilename + ". Please try again!", ex);
        }
    }

    /**
     * Xóa file theo đường dẫn URL tương đối (vd "/uploads/cards/uuid.jpg")
     * @param fileUrl đường dẫn URL file được lưu
     */
    public void deleteFile(String fileUrl) {
        try {
            // Chuyển URL thành đường dẫn file vật lý bằng cách cắt phần "/uploads"
            if (fileUrl.startsWith("/uploads")) {
                String relativePath = fileUrl.substring("/uploads".length()); // vd: /cards/uuid.jpg
                Path filePath = this.fileStorageLocation.resolve(relativePath).normalize();
                Files.deleteIfExists(filePath);
            } else {
                // Nếu đường dẫn không đúng format thì log hoặc bỏ qua
            }
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file: " + fileUrl, ex);
        }
    }
}
