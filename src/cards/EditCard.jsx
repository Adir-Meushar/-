import React, { useContext, useEffect, useState } from "react";
import { GeneralContext, darkTheme } from "../App";
import { cardStructur } from "./AddCard"
import { FaRegEdit } from "react-icons/fa";
import Joi from "joi";
import { Box, Container } from "@mui/system";
import { Button, CssBaseline, Grid, TextField,Typography } from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";

export default function EditCard({ card, cardEdited }) {
    const [formData, setFormData] = useState({});
    const [ismodal, setIsModal] = useState(false);
    const { setLoader, snackbar, currentTheme } = useContext(GeneralContext);
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
        imgUrl: Joi.string().uri({
            scheme: ['http', 'https'],
        }).allow('').messages({
            "string.uri": "Invalid image URL format",
        }),
        imgAlt: Joi.string(),
        state: Joi.string().min(2),
        country: Joi.string().min(2),
        city: Joi.string().min(2),
        street: Joi.string().min(2),
        houseNumber: Joi.number(),
        zip: Joi.number(),
        description: Joi.string().min(10).max(750),
        id: Joi.allow(),
        clientId: Joi.allow(),
        userName: Joi.allow(),
        favorite: Joi.allow(),
        createdTime: Joi.allow(),
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

    useEffect(() => {
        if (card) {
            console.log(card);
            setFormData(card);
        } else {
            setFormData({});
        }
    }, [card])

    function editCard(ev) {
        ev.preventDefault();
        setLoader(true)
        fetch(`https://api.shipap.co.il/business/cards/${card.id}?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(formData),
        })
            .then(() => {
                cardEdited(formData)
                setIsModal(false)
                setLoader(false)
                snackbar(`Card ${card.id} Was Edited Succesfully!`)
            });
    }
    return (
        <>
            {ismodal && (
                <Container className="modal-frame" component="main" maxWidth="xxl">
                    <CssBaseline />
                    <Box
                        className={`modal ${currentTheme === darkTheme ? 'dark-modal' : 'light-modal'}`}
                        sx={{
                            width: '65vw',
                            height: '80vh',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',}} >
                        <Button className="close" onClick={() => setIsModal(false)}>X</Button>
                        <Typography paddingTop={'20px'} component="h2" variant="h5">
                            Edit Card
                        </Typography>
                        <Box component="form" onSubmit={editCard} noValidate >
                            <Grid container spacing={1}>
                                {cardStructur.map((s) => (
                                    <Grid key={s.name} item xs={10} sm={6}>
                                        {s.name === 'description' ? (
                                            <div>
                                                <TextareaAutosize className="text-area"
                                                     placeholder={s.label + '...'}
                                                    name={s.name}
                                                    onChange={handleValid}
                                                    value={formData[s.name]}
                                                    autoComplete={s.name}
                                                />
                                                <span className="helper-text">{errors[s.name]}</span>
                                            </div>
                                        ) : (
                                            <TextField
                                                style={{ height: '75px', marginBottom: '20px' }}
                                                required={s.required}
                                                fullWidth
                                                id={s.name}
                                                label={s.label}
                                                name={s.name}
                                                type={s.type}
                                                autoComplete={s.name}
                                                onChange={handleValid}
                                                value={formData[s.name] || ''}
                                                helperText={errors[s.name]}
                                                error={Boolean(errors[s.name])}/>
                                        )}
                                    </Grid>
                                ))}
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={!isFormValid}
                                        className="save-btn" >
                                        Save Changes
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            )}
            <FaRegEdit className="card-icon" onClick={() => setIsModal(true)} />
        </>
    );
}   