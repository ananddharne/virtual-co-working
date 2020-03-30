import React, { useReducer, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "./table.css"
import Modal from "./Modals/connectionModal"
// import useModal from './Modals/useModal';
import { useModal } from "react-modal-hook";
// import Modali from 'modali';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      padding: 12
    },
    title: {
      fontWeight: 400
  
    },
    divider: {
      marginBottom: "32px"
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-around"
    },
    buttonItem: {
      width: "max-content",
      top: "30px",
      left: "360px"
    },
    advanceSettings: {
      marginTop: 16
    },
    table: {
      width: 75,
      height: 75
    }
  }));

function Table() {
    const classes = useStyles();

    const [showCreateModal, hideCreateModal] = useModal(
        ({ in: open, onExited }) => (
            <div>
         <h1>3gdfgfgf</h1>
         <h1>3gdfgfgf</h1>
         <h1>3gdfgfgf</h1>
         <h1>3gdfgfgf</h1>
         </div>
        )
      );
      const [modalShown, toggleModal] = useState(false)

    return (
<div className="container">
    <div className="content">
        <Button
        className={classes.buttonItem}
        color={true ? "secondary" : "primary"}
        onClick={modalShown? hideCreateModal :showCreateModal}
        variant="contained"
       >
        {true ? "Grab a seat" : "Spectate"}
      </Button>
      {/* <Modal
        isShowing={isShowing}
        hide={toggle}
      /> */}
        {/* <Modali.Modal {...completeExample}>
    Hi, I'm a Modali
  </Modali.Modal> */}
        <div className="table center-stack"></div>
        <div className="profile profile-left center-stack">
            {/* <div className="circle"></div>
            <div className="back"></div> */}
        </div>
        <div className="profile profile-right center-stack">
            {/* <div className="circle"></div>
            <div className="back back-left"></div> */}
        </div>
        <div className="profile profile-up center-stack">
            {/* <div className="img"></div> */}
            {/* <div className="circle"></div> */}
            {/* <div className="back back-left"></div>   */}
        </div>
        <div className="profile profile-down center-stack">
            {/* <div className="img"></div> */}
            {/* <div className="circle"></div>
            <div className="back back-left"></div> */}
        </div>
    </div>
</div>
    )
}
export default Table
