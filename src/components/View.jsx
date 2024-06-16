import React, { useState, useEffect, useRef } from "react";
import { doc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firbase"; // Corrected typo: "firbase" to "firebase"
import { Navigate, useNavigate, useParams } from "react-router-dom";
import "./Styles/view.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import rsImage from "./assets/rs.jpeg";

export const View = () => {
  const [ph, setPh] = useState();
  const [newph, setNewPh] = useState();
  const [billData, setBillData] = useState([]);
  const [final_amount, setFinalAmount] = useState(0);

  const navigate=useNavigate();

  // todays datw
  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;

  // to convert number to word
  const amountInWords = (amount) => {
    const digits = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "Ten",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    // console.log("amount",amount);

    const crores = Math.floor(amount / 10000000);
    amount %= 10000000;
    // console.log("crore",crores);

    const lakhs = Math.floor(amount / 100000);
    amount %= 100000;

    // console.log("lakhs",lakhs);

    const thousands = Math.floor(amount / 1000);
    amount %= 1000;
    // console.log("thousands",thousands);

    const hundreds = Math.floor(amount / 100);
    amount %= 100;

    // console.log("hundres",hundreds);

    const tensAndOnes = String(amount).split("");

    let result = "";

    if (crores > 0) {
      result += digits[crores] + " Crore ";
      result +=
        tens[Math.floor([crores / 10])] + " " + digits[crores % 10] + " Lakh ";
    }

    if (lakhs > 0) {
      result +=
        tens[Math.floor([lakhs / 10])] + " " + digits[lakhs % 10] + " Lakh ";
    }

    if (thousands > 0) {
      result +=
        tens[Math.floor([thousands / 10])] +
        " " +
        digits[thousands % 10] +
        " Thousand ";
    }

    if (hundreds > 0) {
      result += digits[hundreds] + " Hundred ";
    }

    if (tensAndOnes[0] > 0) {
      result += tens[tensAndOnes[0]];

      if (tensAndOnes[1] > 0) {
        result += "-" + digits[tensAndOnes[1]];
      }
    } else if (tensAndOnes[1] > 0) {
      result += tens[tensAndOnes[1]];
    }

    result += " Rupees Only";

    return result;
  };

  let { phone } = useParams();

  // calulation for total amount before tax
  useEffect(() => {
    let totalAmount = 0;

    // Calculate total_amount from billData
    for (let i = 0; i < billData.length; i++) {
      totalAmount += billData[i].total_amount;
      // console.log(totalAmount);
    }

    // Update final_amount
    setFinalAmount(totalAmount);
  }, [billData]); // Depend on billData so this effect runs whenever billData changes

  // function to set phone no.
  useEffect(() => {
    if (phone !== "0" && phone !== null) {
      setPh(phone);
    }
  }, [phone]);

  // for fetching data from firebase
  useEffect(() => {
    const fetchData = async () => {
      if (ph) {
        try {
          const documentRef = doc(db, "bill_project_123", ph);
          const subCollectionRef = collection(documentRef, ph);
          const subCollectionSnapshot = await getDocs(subCollectionRef);
          const billDataArray = [];

          subCollectionSnapshot.forEach((doc) => {
            billDataArray.push(doc.data());
          });

          setBillData(billDataArray);
        } catch (error) {
          console.error("Error fetching subcollection: ", error);
        }
      }
    };

    fetchData();
  }, [ph]);

  //standardisation of currency
  function formatRupees(amount) {
    return amount.toLocaleString();
  }


  // handling download for print
  const componentRef = useRef();

  const handleDownload = () => {
    html2canvas(componentRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${billData[0].Phone_No}.pdf`);
    });
  };

  return (
    <div>
      <div className="empty"></div>
      <h2>
        <label>
          Change Phone No.:
          <input
            className="phone_inp"
            type="number"
            placeholder="phone no."
            value={newph}
            onChange={(event) => setNewPh(event.target.value)}
          />
          <button className="phone_button" onClick={() => setPh(newph)}>
            submit
          </button>
        </label>
      </h2>

      <button className="pdf_button" onClick={handleDownload}>
        Download as PDF
      </button>

      <button className="pdf_button" onClick={() => navigate(`/Bill`)}>
  Back
</button>


      <div ref={componentRef} className="container">
        <div className="header">
          <div>
            <h1>R S JEWELLERS</h1>
            <img src={rsImage} alt="RS Jewelers" />
          </div>
          <h2>GSTIN. 09ARQPV2257D1ZC</h2>
        </div>
        <div className="bill-to">
          <h2>BILL TO:</h2>
          {billData.length > 0 && (
            <table>
              <tr>
                <th>Customer Name :</th>
                <td>{billData[0]?.Name}</td>
                <th>ADDRESS:</th>
                <td>{billData[0]?.Address}</td>
              </tr>
              <tr>
                <th>Mobile No:</th>
                <td>{billData[0]?.Phone_No}</td>
                <th>STATE</th>
                <td>{billData[0]?.State}</td>
              </tr>
              <tr>
                <th>Date:</th>
                <td>{date}</td>
                <th>Payment mode</th>
                <td>{billData[0]?.Payment}</td>
              </tr>
              <tr>
                <th>Invoice No:</th>
                <td></td>
                <th>Adhar no.</th>
                <td>{billData[0]?.Aadhar}</td>
              </tr>
            </table>
          )}
        </div>
        <div className="items">
          <h2>Items:</h2>
          {billData.length > 0 && (
            <table>
              <tr>
                <th>Sr No:</th>
                <th>Item Name</th>
                <th>Qty</th>
                <th>HSN NO</th>
                <th>Gross Wt. (gm)</th>
                <th>Net Wt. (gm)</th>
                <th>Purity</th>
                <th>Rate</th>
                <th>Labour/gm</th>
                <th>Labour</th>
                <th>Hallmark Charges</th>
                <th>Total Amount</th>
              </tr>
              {billData.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.Item_name}</td>
                  <td>{item.Item_Quantity}</td>
                  <td>{item.HSN_CODE}</td>
                  <td>{item.Item_grossweight}</td>
                  <td>{item.Item_netweight}</td>
                  <td>{item.Item_purity}</td>
                  <td>{formatRupees(item.Item_rate)}</td>
                  <td>{formatRupees(item.Item_Labour)}</td>
                  <td>{formatRupees(item.Item_Labour * item.Item_netweight)}</td>
                  <td>{formatRupees(item.Item_hallmark)}</td>
                  <td>{formatRupees(item.total_amount)}</td>
                </tr>
              ))}
            </table>
          )}
        </div>
        <div className="total">
          <h2>Total:</h2>
          {billData.length > 0 && (
            <table>
              <tr>
                <td>CGST 1.5 %</td>
                <th>Total CGST Amt :</th>
                <td>{formatRupees(final_amount * 0.015)}</td>
              </tr>
              <tr>
                <td>SGST 1.5 %</td>
                <th>Total SGST Amt :</th>
                <td>{formatRupees(final_amount * 0.015)}</td>
                <th>Total Amt Before Tax :</th>
                <td>{formatRupees(final_amount)}</td>
              </tr>
              <tr>
                <td></td>
                <th>Total GST Tax :</th>
                <td>{formatRupees(final_amount * 0.03)}</td>
                <th>Total Amount :</th>
                <td>{formatRupees((final_amount * 1.03))}</td>
              </tr>
            </table>
          )}
        </div>
        <div className="footer">
          <table>
            <tr>
              <td>Amount in Words:</td>
              <td>{amountInWords(Math.floor(final_amount * 1.03))}</td>
            </tr>
            <tr>
              <td>Customer Sign :</td>
              <td></td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};
