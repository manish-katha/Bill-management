import React, { useState } from "react";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../config/firbase";
import { Nav } from "./nav";
import "./Styles/bill.css";
import { Link, useNavigate } from "react-router-dom";


export const Bill = () => {
  const [name, setName] = useState("");
  const [phone, setPhno] = useState(0);
  const [address, setAdd] = useState("");
  const [aadhar, setAadhar] = useState("");

  const [serialno, setSrNo] = useState(0);
  const [itemname, setItemName] = useState("");
  const [quantity, setQty] = useState(0);
  const [hsncode, setHsn] = useState("");
  const [grossweight, setGrossWeight] = useState(0);
  const [netweight, setNetWeight] = useState(0);
  const [purity, setPurity] = useState("");
  const [rate, setRate] = useState(0);
  const [Labour, setLabour] = useState(0);
  const [Hallmark, setHall] = useState(0);
  const [paymode, setPay] = useState("");
  const [State, setState] = useState("");

  const [formCount, setFormCount] = useState(1); // State to track the number of forms

  const Navigate=useNavigate();


  const ViewBill = () => {
    console.log("Phone number:", phone); // Log the phone number to check if it's captured correctly
    Navigate(`/View/${phone}`);
  };
  
  

  
  const handleSubmit = (event) => {

    const ammount=parseFloat(netweight) * (parseFloat(rate) + parseFloat(Labour)) + parseFloat(Hallmark);

    event.preventDefault();

    const val = doc(db, "bill_project_123", phone);
    const collect = collection(val, phone);

    addDoc(collect, {
      Name: name,
      Phone_No: phone,
      Aadhar: aadhar,
      Address: address,
      Item_No: serialno,
      Item_name: itemname,
      Item_Quantity: quantity,
      HSN_CODE: hsncode,
      Item_grossweight: grossweight,
      Item_netweight: netweight,
      Item_purity: purity,
      Item_rate: rate,
      Item_Labour: Labour,
      Item_hallmark: Hallmark,
      total_amount: ammount,
      Payment:paymode,
      State: State,
    });
    alert("data submitted");
  };

  const billform = () => {
    return (
      <>
        <form className="FORM" onSubmit={handleSubmit}>
          <label>
            Sr No.:
            <input
              type="number"
              onChange={(event) => setSrNo(event.target.value)}
            />
          </label>
          <label>
            Item Name:
            <input
              type="text"
              placeholder="item name"
              onChange={(event) => setItemName(event.target.value)}
            />
          </label>
          <label>
            Quantity:
            <input
              type="number"
              placeholder="Quantity"
              onChange={(event) => setQty(event.target.value)}
            />
          </label>
          <label>
            HSN Code:
            <input
              type="text"
              placeholder="HSN Code"
              onChange={(event) => setHsn(event.target.value)}
            />
          </label>
          <label>
            Gross Weight(gm):
            <input
              type="float"
              placeholder="Weight"
              onChange={(event) => setGrossWeight(event.target.value)}
            />
          </label>
          <label>
            Net Weight(gm):
            <input
              type="float"
              placeholder="Weight"
              onChange={(event) => setNetWeight(event.target.value)}
            />
          </label>
          <label>
            Purity:
            <input
              type="text"
              placeholder="purity"
              onChange={(event) => setPurity(event.target.value)}
            />
          </label>
          <label>
            Rate:
            <input
              type="number"
              placeholder="Rate"
              onChange={(event) => setRate(event.target.value)}
            />
          </label>
          <label>
            Labour/gm:
            <input
              type="number"
              placeholder="Labour charge"
              onChange={(event) => setLabour(event.target.value)}
            />
          </label>
          <label>
            Hall Mark Charges:
            <input
              type="number"
              placeholder="hall mark charges"
              onChange={(event) => setHall(event.target.value)}
            />
          </label>
          <label>
            Payment Mode:
            <input
              type="strin"
              placeholder="payment mode"
              onChange={(event) => setPay(event.target.value)}
            />
          </label>

          <button type="submit">Submit</button>
        </form>
      </>
    );
  };

  const renderForms = () => {
    const forms = [];
    for (let i = 0; i < formCount; i++) {
      forms.push(billform()); // Call billform function and add its result to forms array
    }
    return forms;
  };

  return (
    <>
      <Nav />
      <div className="bill-container">
        <label>
          Name:
          <input
            type="text"
            placeholder="customer name"
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          Phone no.:
          <input
            type="tel"
            placeholder="phone no."
            onChange={(event) => setPhno(event.target.value)}
          />
        </label>
        <label>
          Aadhar No.:
          <input
            type="tel"
            placeholder="aadhar no."
            onChange={(event) => setAadhar(event.target.value)}
          />
        </label>
        <label>
          Address:
          <input
            type="string"
            placeholder="address."
            onChange={(event) => setAdd(event.target.value)}
          />
        </label>
        <label>
          State:
          <input
            type="string"
            placeholder="state"
            onChange={(event) => setState(event.target.value)}
          />
        </label>
      </div>
      {renderForms()} {/* Render multiple bill forms */}
      <button className="add" onClick={() => setFormCount(formCount + 1)}>
        Add more
      </button>
      <button className="add" onClick={ViewBill }>
       View Bill
      </button>
      
    </>
  );
};
