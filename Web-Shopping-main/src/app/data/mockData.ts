// หมวดหลัก
export const categories = [
  { id: 1, name: "มือถือ แท็บเล็ต", slug: "มอถอ-แทบเลต", image: "https://str.cdn.kaidee.com/29.png" },
  { id: 2, name: "คอมพิวเตอร์", slug: "คอมพวเตอร", image: "https://str.cdn.kaidee.com/27.png" },
  { id: 3, name: "เครื่องดนตรี", slug: "เครองดนตร", image: "https://str.cdn.kaidee.com/60.png" },
  { id: 4, name: "กีฬา", slug: "กฬา", image: "https://str.cdn.kaidee.com/61.png" },
  { id: 5, name: "จักรยาน", slug: "จกรยาน", image: "https://str.cdn.kaidee.com/123.png" },
  { id: 6, name: "แม่และเด็ก", slug: "แมและเดก", image: "https://str.cdn.kaidee.com/130.png" },
  { id: 7, name: "กระเป๋า", slug: "กระเปา", image: "https://str.cdn.kaidee.com/95.png" },
  { id: 8, name: "นาฬิกา", slug: "นาฬกา", image: "https://str.cdn.kaidee.com/99.png" },
  { id: 9, name: "รองเท้า", slug: "รองเทา", image: "https://str.cdn.kaidee.com/96.png" },
  { id: 10, name: "เสื้อผ้า เครื่องแต่งกาย", slug: "เสอผา-เครองแตงกาย", image: "https://str.cdn.kaidee.com/5.png" },
  { id: 11, name: "สุขภาพและความงาม", slug: "สขภาพและความงาม", image: "https://str.cdn.kaidee.com/6.png" },
  { id: 12, name: "บ้านและสวน", slug: "บานและสวน", image: "https://str.cdn.kaidee.com/3.png" },
  { id: 13, name: "พระเครื่อง", slug: "พระเครอง", image: "https://str.cdn.kaidee.com/57.png" },
  { id: 14, name: "ของสะสม", slug: "ของสะสม", image: "https://str.cdn.kaidee.com/103.png" },
  { id: 15, name: "กล้อง", slug: "กลอง", image: "https://str.cdn.kaidee.com/28.png" },
  { id: 16, name: "เครื่องใช้ไฟฟ้า", slug: "เครองใชไฟฟา", image: "https://str.cdn.kaidee.com/70.png" },
  { id: 17, name: "เกม", slug: "เกม", image: "https://str.cdn.kaidee.com/31.png" },
  { id: 18, name: "สัตว์เลี้ยง", slug: "สตวเลยง", image: "https://str.cdn.kaidee.com/62.png" },
  { id: 19, name: "อสังหาริมทรัพย์", slug: "อสงหารมทรพย", image: "https://str.cdn.kaidee.com/2.png" },
  { id: 20, name: "รถมือสอง", slug: "รถมอสอง", image: "https://str.cdn.kaidee.com/11.png" },
  { id: 21, name: "รถบรรทุก และรถเครื่องจักรกล", slug: "รถบรรทก-และรถเครองจกรกล", image: "https://str.cdn.kaidee.com/307.png" },
  { id: 22, name: "ยานพาหนะอื่นๆ", slug: "ยานพาหนะอนๆ", image: "https://str.cdn.kaidee.com/304.png" },
  { id: 23, name: "อะไหล่รถ ประดับยนต์", slug: "อะไหลรถ-ประดบยนต", image: "https://str.cdn.kaidee.com/270.png" },
  { id: 24, name: "มอเตอร์ไซค์", slug: "มอเตอรไซค", image: "https://str.cdn.kaidee.com/149.png" },
  { id: 25, name: "งานอดิเรก", slug: "งานอดเรก", image: "https://str.cdn.kaidee.com/10.png" },
  { id: 26, name: "ธุรกิจ", slug: "ธรกจ", image: "https://str.cdn.kaidee.com/7.png" },
  { id: 27, name: "บริการ", slug: "บรการ", image: "https://str.cdn.kaidee.com/45.png" },
  { id: 28, name: "ฟาร์ม", slug: "ฟารม", image: "https://str.cdn.kaidee.com/325.png" },
  { id: 29, name: "ท่องเที่ยว", slug: "ทองเทยว", image: "https://str.cdn.kaidee.com/9.png" },
  { id: 30, name: "การศึกษา", slug: "การศกษา", image: "https://str.cdn.kaidee.com/8.png" },
  { id: 31, name: "บริจาค", slug: "บรจาค", image: "https://str.cdn.kaidee.com/283.png" },
];


// หมวดรอง
export const subcategories = [
  { id: 1, name: "สมาร์ทโฟน", slug: "smartphone", parentSlug: "mobile" },
  { id: 2, name: "โทรศัพท์ปุ่มกด", slug: "feature-phone", parentSlug: "mobile" },
];

// ✅ สินค้า (Product[])
// ✅ สินค้า (Product[])
export const products = [
  {
    id: "1",
    title: "iPhone 15",
    description: "สมาร์ทโฟนรุ่นใหม่จาก Apple พร้อมชิป A17 Pro",
    images: ["/images/iphone15.jpg"],
    options: [
      {
        option_name: "iPhone 15 128GB",
        price: "999",
        image_url: "/images/iphone15.jpg",
      },
    ],
    ratings: 4.8,
    num_reviews: 150,
    category: "smartphone",
    shipping: { delivery_area: "ทั่วประเทศ", shipping_fee: "50" },
  },
  {
    id: "2",
    title: "Samsung Galaxy S23",
    description: "สมาร์ทโฟนเรือธงจาก Samsung พร้อมกล้อง 200MP",
    images: ["/images/galaxy-s23.jpg"],
    options: [
      {
        option_name: "Galaxy S23 256GB",
        price: "899",
        image_url: "/images/galaxy-s23.jpg",
      },
    ],
    ratings: 4.7,
    num_reviews: 120,
    category: "smartphone",
    shipping: { delivery_area: "ทั่วประเทศ", shipping_fee: "40" },
  },
  {
    id: "3",
    title: "Nokia 3310",
    description: "โทรศัพท์ปุ่มกดในตำนาน แบตอึดสุดๆ",
    images: ["/images/nokia3310.jpg"],
    options: [
      {
        option_name: "Nokia 3310 Original",
        price: "50",
        image_url: "/images/nokia3310.jpg",
      },
    ],
    ratings: 4.5,
    num_reviews: 45,
    category: "feature-phone",
    shipping: { delivery_area: "ทั่วประเทศ", shipping_fee: "20" },
  },
  {
    id: "4",
    title: "MacBook Air M2",
    description: "โน้ตบุ๊กเบา บาง พร้อมชิป Apple M2",
    images: ["/images/macbook-air.jpg"],
    options: [
      {
        option_name: "MacBook Air M2 512GB",
        price: "1200",
        image_url: "/images/macbook-air.jpg",
      },
    ],
    ratings: 4.9,
    num_reviews: 200,
    category: "laptop",
    shipping: { delivery_area: "ทั่วประเทศ", shipping_fee: "60" },
  },
    { id: 2, name: "Samsung Galaxy S23", price: 899, image: "/images/galaxy-s23.jpg", categorySlug: "smartphone" },

  
];
