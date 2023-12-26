const certificateLinks = "https://link1.com;https://link2.com;https://link3.com";

// Tách chuỗi thành mảng các đường link bằng dấu chấm phẩy
const linksArray = certificateLinks.split(';');

// Hiển thị danh sách đường link trong front-end
linksArray.forEach(link => {
    console.log(link); // Thay console.log(link) bằng cách hiển thị thực tế trên giao diện người dùng
});