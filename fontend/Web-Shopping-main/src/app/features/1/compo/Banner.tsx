import Image from "next/image";

const Banner = () => (
  <section
    className="banner"
    style={{
      width: "100%",
      maxWidth: "1300px",
      margin: "40px auto",
      position: "relative",
      borderRadius: "10px",
      overflow: "hidden",
    }}
  >
    <img
      src="https://str.cdn.kaidee.com/250826-eKYC_KD-Homepage3.jpg"
      alt="Shipping Banner"
      style={{ width: "100%", height: "auto", borderRadius: "10px" }}
    />
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "white",
        textAlign: "center",
        width: "90%",
      }}
    >
      <h2 style={{ fontSize: "2.8rem", fontWeight: "bold" }}>
        ส่งสินค้ารวดเร็ว ปลอดภัย และคุ้มค่า
      </h2>
      <p style={{ fontSize: "1.3rem", marginTop: "10px" }}>
        บริการขนส่งที่เชื่อถือได้ ส่งสินค้าของคุณไปยังทุกที่ทั่วโลก
      </p>
      <a
        href="#"
        style={{
          backgroundColor: "#ff6200",
          color: "white",
          padding: "12px 25px",
          textDecoration: "none",
          borderRadius: "5px",
          fontWeight: "bold",
          marginTop: "15px",
          display: "inline-block",
        }}
      >
        เริ่มใช้งาน
      </a>
    </div>
  </section>
);

export default Banner;
