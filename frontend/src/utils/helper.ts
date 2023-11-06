export const previewImage = (image: File | null, imageRef: React.RefObject<HTMLImageElement>, imageSource?: string) => {
    if (image && image.type.includes("image/")) {
        var reader = new FileReader();
        reader.onload = function (e) {
            if (imageRef.current) {
                imageRef.current.src = e.target?.result as string;
            }
        };
        reader.readAsDataURL(image);
        return;
    } else {
        if (imageRef.current && imageSource) {
            imageRef.current.src = imageSource;
        } else if (imageRef.current) {
            imageRef.current.src = "";
        }
    }
};

export const convertDateFormat = (inputDate: string) => {
    const date = new Date(inputDate); // Chuyển chuỗi thành đối tượng ngày tháng
    const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày và đảm bảo rằng nó có 2 chữ số
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (chú ý tháng bắt đầu từ 0) và đảm bảo rằng nó có 2 chữ số
    const year = date.getFullYear(); // Lấy năm

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
};