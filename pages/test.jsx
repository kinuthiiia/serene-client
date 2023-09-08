import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Test = () => {
  const [user, setUser] = useState({
    name: "John Doe", // Replace with the user's name
    dateOfCompletion: "2023-09-01", // Replace with the date of completion
    courseName: "Basic Fire Safety Training", // Replace with the course name
  });

  const generateCertificate = () => {
    // Reference to the certificate container
    const certificateContainer = document.getElementById(
      "certificate-container"
    );

    // Create a canvas from the certificate container
    html2canvas(certificateContainer).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape", // Landscape A4
      });

      // Add an image of the certificate to the PDF
      pdf.addImage(imgData, "PNG", 0, 0, 297, 210); // A4 dimensions

      // Download the PDF with a custom filename
      pdf.save("certificate.pdf");
    });
  };

  return (
    <div>
      <div id="certificate-container" className="certificate">
        {/* Certificate content */}
        <img src="/blankcert.png" alt="" className="w-full" />
        <p className="absolute top-[56%] text-[3rem] left-[50%] translate-x-[-50%]">
          {user.name}
        </p>
        <p className="absolute top-[82%] text-[1.5rem] left-[150px]">
          {user.dateOfCompletion}
        </p>
        <p className="absolute top-[68%] w-[90%] text-[1.4rem] text-[#263A8F] left-[50%] translate-x-[-50%] text-center">
          {" "}
          for successfully completing {user.courseName}
        </p>
      </div>

      {/* Button to generate and download the certificate */}
      <button onClick={generateCertificate}>Download Certificate</button>

      <style jsx>{`
        /* CSS for the certificate container */
        .certificate {
          position: relative;
          width: 297mm; /* A4 width */
          height: 210mm; /* A4 height */
          background-color: #ffffff; /* Certificate background color */
          /* Add other certificate styling here */
        }
      `}</style>
    </div>
  );
};

export default Test;
