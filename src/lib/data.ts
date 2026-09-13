export interface ImageData {
    id: number;
    title: string;
    src: string;
}

export const images: ImageData[] = [
    { id: 1, title: "Balloon", src: "/images/balloon.jpg" },
    { id: 2, title: "Basket", src: "/images/basket.jpg" },
    { id: 3, title: "Clouds", src: "/images/clouds.jpg" },
    { id: 4, title: "Dune", src: "/images/dune.jpg" },
    { id: 5, title: "Eye", src: "/images/eye.jpg" },
    { id: 6, title: "Falling", src: "/images/falling.jpg" },
    { id: 7, title: "Field", src: "/images/field.jpg" },
    { id: 8, title: "Fuji", src: "/images/fuji.jpg" },
    { id: 9, title: "Heynh", src: "/images/heynh.jpg" },
    { id: 10, title: "House", src: "/images/house.jpg" },
    { id: 11, title: "Img 1", src: "/images/img1.jpg" },
    { id: 12, title: "Img 2", src: "/images/img2.jpg" },
    { id: 13, title: "Img 3", src: "/images/img3.jpg" },
    { id: 14, title: "Img 4", src: "/images/img4.jpg" },
    { id: 15, title: "Img 6", src: "/images/img6.jpg" },
    { id: 16, title: "Lighthouse", src: "/images/lighthouse.jpg" },
    { id: 17, title: "Mountain", src: "/images/mt.jpg" },
    { id: 18, title: "Spider", src: "/images/spider.jpg" },
    { id: 19, title: "Water", src: "/images/wa.jpg" },
    { id: 20, title: "Wheat", src: "/images/wheat.jpg" },
];

export const imagePaths: string[] = images.map((img) => img.src);