import React, { useState, useEffect, useRef } from "react";
import { doc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firbase";
import { useNavigate, useParams } from "react-router-dom";
import "./Styles/view.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import rsImage from "./assets/rs.jpeg";

export const View = () => {
  const [ph, setPh] = useState();
  const [newph, setNewPh] = useState();
  const [billData, setBillData] = useState([]);
  const [final_amount, setFinalAmount] = useState(0);

  const navigate = useNavigate();

  // Get today's date
  const current = new Date();
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`;

  // Function to convert number to words
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

    let result = "";

    if (amount > 9999999) {
      const crores = Math.floor(amount / 10000000);
      amount %= 10000000;
      result += digits[crores] + " Crore ";
    }

    if (amount > 99999) {
      const lakhs = Math.floor(amount / 100000);
      amount %= 100000;
      result += digits[lakhs] + " Lakh ";
    }

    if (amount > 999) {
      const thousands = Math.floor(amount / 1000);
      amount %= 1000;
      result += digits[thousands] + " Thousand ";
    }

    if (amount > 99) {
      const hundreds = Math.floor(amount / 100);
      amount %= 100;
      result += digits[hundreds] + " Hundred ";
    }

    if (amount > 19) {
      result += tens[Math.floor(amount / 10)];
      amount %= 10;
    }

    result += digits[amount];

    result += " Rupees Only";

    return result;
  };

  let { phone } = useParams();

  // Calculate total amount before tax
  useEffect(() => {
    let totalAmount = 0;
    billData.forEach((item) => {
      totalAmount += item.total_amount;
    });
    setFinalAmount(totalAmount);
  }, [billData]);

  // Set phone number if it's provided
  useEffect(() => {
    if (phone !== "0" && phone !== null) {
      setPh(phone);
    }
  }, [phone]);

  // Fetch data from Firebase based on phone number
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

  // Standardize currency format
  function formatRupees(amount) {
    if (amount === undefined || amount === null) {
      return "0";
    }
    return amount.toLocaleString();
  }

  // Handle download as PDF
  const componentRef = useRef();

  const handleDownload = () => {
    html2canvas(componentRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${billData[0]?.Phone_No}.pdf`);
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
            Submit
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
              <tbody>
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
              </tbody>
            </table>
          )}
        </div>
        <div className="items">
          <h2>Items:</h2>
          {billData.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Sr No:</th>
                  <th>Item Name</th>
                  <th>Qty</th>
                  <th>HSN NO</th>
                  <th>Gross Wt. (gm)</th>
                  <th>Wastage (%)</th>
                  <th>Net Wt. (gm)</th>
                  <th>Purity</th>
                  <th>Rate</th>
                  <th>Labour/gm</th>
                  <th>Labour</th>
                  <th>Hallmark Charges</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {billData.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.Item_name}</td>
                    <td>{item.Item_Quantity}</td>
                    <td>{item.HSN_CODE}</td>
                    <td>{item.Item_grossweight}</td>
                    <td>{item.Item_wastage}</td>
                    <td>{item.Item_netweight}</td>
                    <td>{item.Item_purity}</td>
                    <td>{formatRupees(item?.Item_rate || 0)}</td>
<td>{formatRupees(item?.Item_Labour || 0)}</td>
<td>{formatRupees((item?.Item_Labour || 0) * (item?.Item_netweight || 0))}</td>
<td>{formatRupees(item?.Item_hallmark || 0)}</td>
<td>{formatRupees(item?.total_amount || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="total">
          <h2>Total:</h2>
          {billData.length > 0 && (
            <table>
              <tbody>
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
                  <td>{formatRupees(final_amount * 1.03)}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
        <div className="footer">
          <table>
            <tbody>
              <tr>
                <td>Amount in Words:</td>
                <td>{amountInWords(Math.floor(final_amount * 1.03))}</td>
              </tr>
              <tr>
                <td>Customer Sign :</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
