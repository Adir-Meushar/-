import React, { useContext, useState } from "react";
import { GeneralContext } from "../App";
import { RoleTyps } from "../components/Navbar";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Joi from "joi";
import { Box, Container } from "@mui/system";
import { Avatar, Button, CssBaseline, FormControlLabel, Grid, Modal, Switch, TextField, TextareaAutosize, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import './addEditModal.css'

export const cardStructur = [
    { name: 'title', type: 'text', label: 'title', required: true, block: false },
    { name: 'subtitle', type: 'text', label: 'subtitle', required: true, block: false },
    { name: 'phone', type: 'tel', label: 'Phone', required: true, block: false },
    { name: 'email', type: 'text', label: 'Email', required: true, block: false },
    { name: 'web', type: 'text', label: 'web', required: true, block: false, initialOnly: true },
    { name: 'imgUrl', type: 'text', label: 'Img Url', required: true, block: true },
    { name: 'imgAlt', type: 'text', label: 'Img Alt', required: true, block: false },
    { name: 'state', type: 'text', label: 'State', required: true, block: false },
    { name: 'country', type: 'text', label: 'Country', required: true, block: false },
    { name: 'city', type: 'text', label: 'City', required: true, block: false },
    { name: 'street', type: 'text', label: 'Street', required: true, block: false },
    { name: 'houseNumber', type: 'number', label: 'House Number', required: true, block: false },
    { name: 'description', type: 'text', label: 'Description', required: true, block: false },
    { name: 'zip', type: 'number', label: 'Zip', required: true, block: false },

];
const initialFormData = cardStructur.reduce((obj, field) => {
    obj[field.name] = '';
    return obj;
}, {});
export default function AddCard({ added }) {
    const [ismodal, setIsModal] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [isFormValid, setIsFormValid] = useState(false)
    const [errors, setErrors] = useState({})
    const schema = Joi.object({
        title: Joi.string().min(2),
        subtitle: Joi.string().min(2),
        web: Joi.string().min(2),
        email: Joi.string().email({ tlds: false }).required(),
        phone: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
            "string.pattern.base": "Phone must be a number 10-13.",
            "any.required": "Password is required",
        }),
        imgUrl: Joi.string().min(8),
        imgAlt: Joi.string().min(2),
        state: Joi.string().min(2),
        country: Joi.string().min(2),
        city: Joi.string().min(2),
        street: Joi.string().min(2),
        houseNumber: Joi.number(),
        zip: Joi.number(),
        description: Joi.string().min(10)
    });
    const handleValid = (ev) => {
        const { name, value } = ev.target;
        const obj = { ...formData, [name]: value }
        setFormData(obj)
        const validate = schema.validate(obj, { abortEarly: false })
        const tempErrors = { ...errors }
        delete tempErrors[name];
        console.log(validate);
        if (validate.error) {
            const item = validate.error.details.find((e) => e.context.key == name)
            if (item) {
                tempErrors[name] = item.message;
            }
        }
        setIsFormValid(!validate.error)
        setErrors(tempErrors)
    }
    const {  setLoader,snackbar } = useContext(GeneralContext);
 
    function addCard(ev) {
        ev.preventDefault();
        setLoader(true)
        fetch(`https://api.shipap.co.il/business/cards?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then(res => res.json())
            .then((data) => {
                added(data)
                setLoader(false)
                setIsModal(false)
                setIsFormValid(false);
                setFormData(initialFormData)
                snackbar(`Card Added Succesfully!`)
            });
    }
    return (
        <>
            {ismodal && (
                <Container className="modal-frame" component="main" maxWidth="xxl">
                    <CssBaseline />
                    <Box
                        className='modal'
                        sx={{
                            width: '65vw',
                            height: '80vh',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Button className="close" onClick={() => setIsModal(false)}>X</Button>
                        <Typography component="h2" variant="h5">
                            Add New Card
                        </Typography>
                        <Box component="form" onSubmit={addCard} noValidate >
                            <Grid container spacing={1}>
                                {cardStructur.map((s) => (
                                    <Grid key={s.name} item xs={10} sm={6}>
                                        {s.name === 'description' ? (
                                            <div>
                                                <TextareaAutosize className="textArea"
                                                    rowsMin={3}
                                                    required={s.required}
                                                    placeholder={s.label+'...'}
                                                    name={s.name}
                                                    onChange={handleValid}
                                                    value={formData[s.name]}
                                                    autoComplete={s.name}
                                                    style={{ maxHeight: '200px', minHeight: '100px' }}
                                                />
                                                <span className="helper-text">{errors[s.name]}</span>
                                            </div>
                                        ) : (
                                            <TextField
                                                style={{ height: '75px' }}
                                                required={s.required}
                                                fullWidth
                                                id={s.name}
                                                label={s.label}
                                                name={s.name}
                                                type={s.type}
                                                autoComplete={s.name}
                                                onChange={handleValid}
                                                value={formData[s.name]}
                                                helperText={errors[s.name]}
                                            />
                                        )}
                                    </Grid>
                                ))}
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={!isFormValid}>
                                        Add
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            )}
            <AiOutlinePlusCircle onClick={() => setIsModal(true)} className="plusBtn" />
        </>
    );
}      