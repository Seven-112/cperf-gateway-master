import React, { useEffect, useMemo, useRef, useState } from "react"
import { Box, BoxProps, makeStyles, Typography, TypographyProps } from "@material-ui/core";
import { IRootState } from "../reducers";
import { connect } from "react-redux";
import ReactQuill, { Quill } from 'react-quill';
import EditorToolbar from "./quill-toolbar";
import ImageResize from 'quill-image-resize-module-react';
 
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

const useStyles = makeStyles({
    editor:{
        width: '100%',
        overflow: 'auto',
    }
})


Quill.register('modules/imageResize', ImageResize);

export interface IMyCustomRTE{
    content?: string,
    label?: string,
    labelProps?: TypographyProps,
    labelBoxContainerProps?: BoxProps,
    readonly?: boolean,
    rootBoxProps?: BoxProps,
    toolbarBoxProps?: BoxProps,
    editorMinHeight?: string | number,
    editorMaxHeight?: string | number,
    onSave?: Function,
}

interface MyCustomRTEProps extends IMyCustomRTE, StateProps{}

export const MyCustomRTE = (props:MyCustomRTEProps) =>{
    const [content, setContent] = useState(props.content || '');
    const [edited, setEdited] = useState(false);

    const editorRef = useRef(null);

    const classes = useStyles();

    const handleBlur = () =>{
        console.log("blur event", editorRef.current, content)
        if(!props.readonly && props.onSave)
            props.onSave(content);
        setEdited(false);
    }
    
    const stripHtml = (html) =>{
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
     }
     
     const handleSave = () =>{
         if(!props.readonly && props.onSave && editorRef){
             const saved = editorRef.current.state.value;
             console.log(typeof saved);
             props.onSave(saved && stripHtml(saved.toString()) !== "" ? saved : null);
         }
         setEdited(false);
     }
 

    useEffect(() =>{
        setContent(props.content || '');
        setEdited(false);
    }, [props.content])

    const handleChange = (value) =>{
        if(!props.readonly){
            setContent(value);
            setEdited(true);
        }
    }
    // Undo and redo functions for Custom Toolbar
    const undoChange =() =>{
        if(editorRef && editorRef.current)
            editorRef.current.editor.history.undo();
    }

    const redoChange =() =>{
        if(editorRef && editorRef.current)
            editorRef.current.editor.history.redo();
        // this.quill.history.redo();
    }
    const modules = useMemo(() =>({
        toolbar: {
          container: "#quill-toolbar",
          handlers: {
            undo: undoChange,
            redo: redoChange,
            save: handleSave,
          }
        },
        clipboard: {
          // toggle to add extra line breaks when pasting HTML:
          matchVisual: false
        },
        imageResize: {
          parchment: Quill.import('parchment'),
          modules: ['Resize', 'DisplaySize','Toolbar']
        },
        history: {
          delay: 500,
          maxStack: 100,
          userOnly: true
        }
      }), []);

      const formats = [
        "header",
        // "font",
        // "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "align",
        "script",
        "blockquote",
        "color",
        "background",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "video",
        "code-block"
      ];

    return (
            <React.Fragment>
                <Box {...props.rootBoxProps}>
                    {props.label && <Box width={1} {...props.labelBoxContainerProps}>
                        <Typography variant="caption" {...props.labelProps}>{props.label}</Typography>
                    </Box>}
                    <Box width={1}>
                        <EditorToolbar readonly={!edited} boxProps={props.toolbarBoxProps}/>
                    </Box> 
                    <Box display="flex"
                        width={1} 
                        overflow="auto" 
                        minHeight={props.editorMinHeight}
                        maxHeight={props.editorMaxHeight}>
                        <ReactQuill 
                            ref={editorRef}
                            theme={props.readonly ? 'bubble' : 'snow'} 
                            value={content}
                            modules={modules}
                            formats={formats}
                            className={classes.editor}
                            onChange={handleChange} 
                        />
                    </Box>
                </Box>
            </React.Fragment>
        )
}

const mapStateToProps = ({ locale } : IRootState) =>({
    langKey: locale.currentLocale,
})

type StateProps = ReturnType<typeof mapStateToProps>;

export default  connect(mapStateToProps)(MyCustomRTE);