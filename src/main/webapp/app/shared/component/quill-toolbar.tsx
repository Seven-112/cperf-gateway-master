import { faCheckCircle, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, BoxProps, makeStyles } from "@material-ui/core";
import theme from "app/theme";
import React from "react";
import { translate } from "react-jhipster";

const useStyles = makeStyles({
   saveIcon:{
     fontSize: 20,
     color: theme.palette.success.main,
     '&:hover':{
      color: theme.palette.success.dark,
      fontSize: 22,
     }
   },
   toolbar:{
   }
})

// Custom Undo button icon component for Quill editor. You can import it directly
// from 'quill/assets/icons/undo.svg' but I found that a number of loaders do not
// handle them correctly
const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path
      className="ql-stroke"
      d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
  </svg>
);

// Redo button icon component for Quill editor
const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path
      className="ql-stroke"
      d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
  </svg>
);


// saved button icon component

const CustomSave = (props) =>{
  const classes = useStyles();
  return (
    <span className="d-inline-block p-0 m-0">
      {!props.readonly && 
        <FontAwesomeIcon 
          icon={faCheckCircle}
          className={classes.saveIcon}
          size="lg"
          title={translate("_global.label.validUpdates")} /> }
    </span>
  );
}

interface QuillToolbarProps{
  readonly?: boolean,
  boxProps?: BoxProps,
}

// Quill Toolbar component
export const QuillToolbar = (props: QuillToolbarProps) =>{
  const classes = useStyles();
  return (
    <Box id="quill-toolbar" width={1}
    display="flex" justifyContent="space-around" 
    alignItems="center" flexWrap="wrap"
    className={classes.toolbar} {...props.boxProps}>
      <span className="ql-formats">
        <select className="ql-header" defaultValue="3">
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">H4</option>
          <option value="5">H5</option>
        </select>
        {/* <select className="ql-font" defaultValue="arial" /> */}
        {/* <select className="ql-size" defaultValue="medium">
          <option value="extra-small">Size 1</option>
          <option value="small">Size 2</option>
          <option value="medium">Size 3</option>
          <option value="large">Size 4</option>
        </select> */}
      </span>
      <span className="ql-formats">
        <button className="ql-bold" title="bold"/>
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
      </span>
      <span className="ql-formats">
        <select className="ql-align" />
        <button className="ql-script" value="super" />
        <button className="ql-script" value="sub" />
        </span>
      <span className="ql-formats">
        <button className="ql-blockquote" title="blockquote"/>
      </span>
      <span className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
      </span>
      <span className="ql-formats">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
      </span>
      <span className="ql-formats">
        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-video" />
      </span>
      <span className="ql-formats">
        <button className="ql-formula" />
        <button className="ql-code-block" />
        <button className="ql-clean" />
      </span>
      <span className="ql-formats">
        <button className="ql-undo">
          <CustomUndo />
        </button>
        <button className="ql-redo">
          <CustomRedo />
        </button>
      </span>
      <span className="ql-formats">
        <button className="ql-save">
          <CustomSave readonly={props.readonly} />
        </button>
      </span>
    </Box>
  )
};

export default QuillToolbar;