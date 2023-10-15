import React, { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Joi from 'joi';
import { GeneralContext, darkTheme } from '../App';
import { clientStructure } from '../user/Signup';

const modifiedClientStructure = clientStructure.map((item) =>
    item.name === 'email' ? { ...item, block: true } : item);
export default function UsersEditAdmin({ usersDetails, closeUserEdit, updateUserState }) {
    const { user, setUser, setLoader, snackbar, currentTheme } = useContext(GeneralContext);
    const [formData, setFormData] = useState({
        // Set initial state to empty values
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        // You may or may not include password editing
        phone: '',
        imgUrl: '',
        imgAlt: '',
        state: '',
        country: '',
        city: '',
        street: '',
        houseNumber: '',
        zip: '',
        business: false,
    });
    useEffect(() => {
        if (usersDetails) {
            setFormData({
                firstName: usersDetails.firstName || '',
                middleName: usersDetails.middleName || '',
                lastName: usersDetails.lastName || '',
                email: usersDetails.email || '',
                // You may or may not include password editing
                phone: usersDetails.phone || '',
                imgUrl: usersDetails.imgUrl || '',
                imgAlt: usersDetails.imgAlt || '',
                state: usersDetails.state || '',
                country: usersDetails.country || '',
                city: usersDetails.city || '',
                street: usersDetails.street || '',
                houseNumber: usersDetails.houseNumber || '',
                zip: usersDetails.zip || '',
                business: usersDetails.business || false,
            });
        }
    }, [usersDetails]);
    const [isFormValid, setIsFormValid] = useState(true);
    const [errors, setErrors] = useState({});
    const schema = Joi.object({
        firstName: Joi.string().min(2),
        middleName: Joi.allow(),
        lastName: Joi.string().min(2),
        email: Joi.string().email({ tlds: false }).required(),
        phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
        imgUrl: Joi.string(),
        imgAlt: Joi.string(),
        state: Joi.string().min(2),
        country: Joi.string().min(2),
        city: Joi.string().min(2),
        street: Joi.string().min(2),
        houseNumber: Joi.number(),
        zip: Joi.number(),
        business: Joi.boolean(),
    });

    const handleValid = (ev) => {
        const { name, value } = ev.target;
        const obj = { ...formData, [name]: value };
        setFormData(obj);
        const validate = schema.validate(obj, { abortEarly: false });
        const tempErrors = { ...errors };
        delete tempErrors[name];
        if (validate.error) {
            const item = validate.error.details.find((e) => e.context.key === name);
            if (item) {
                tempErrors[name] = item.message;
            }
        }
        setErrors(tempErrors);
        setIsFormValid(!validate.error);
        console.log(validate.error);
    };

    const handleSubmit = (ev, userId) => {
        ev.preventDefault();
        const obj = { ...formData };
        setLoader(true);
        fetch(`https://api.shipap.co.il/admin/clients/${userId}?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
            credentials: 'include',
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(obj),
        })

            .then(() => {
                setLoader(false);
                snackbar(`User Number ${userId} Was Updated Succesfully!`)
                updateUserState(obj);

            }).catch((err) => {
                console.error(err);
                setLoader(false);
            });
    };

    return (
        <>
            {usersDetails ? (
                <Container className="modal-frame" component="main" maxWidth="xxl">
                    <CssBaseline />
                    <Box
                        className={`modal ${currentTheme === darkTheme ? 'dark-modal' : 'light-modal'}`}
                        sx={{
                            width: '50vw',
                            marginTop: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}>
                        <Button className="close" onClick={() => closeUserEdit()}>X</Button>
                        <Typography paddingTop={'20px'} component="h1" variant="h5">
                            Edit User Account
                        </Typography>
                        <Box component="form" onSubmit={(ev) => handleSubmit(ev, usersDetails.id)} noValidate sx={{ mt: 1 }}>
                            <Grid container spacing={2}>
                                {modifiedClientStructure.map((s) => (
                                    <Grid key={s.name} item sm={s.block ? 12 : 6}>
                                        {s.type === 'boolean' ? (
                                            <FormControlLabel style={{ marginTop: '25px' }}
                                                control={
                                                    <Switch
                                                        color="primary"
                                                        name={s.name}
                                                        checked={formData[s.name]}
                                                        onChange={() => alert('User type are not allowed to be Changed, you can create a new user with your preferences')}
                                                    />
                                                }
                                                label={s.label}
                                                labelPlacement="start"
                                            />
                                        ) : s.name !== 'password' ? ( // Check if s.name is not equal to 'password'
                                            <TextField
                                                margin="normal"
                                                required={s.required}
                                                fullWidth
                                                id={s.name}
                                                label={s.label}
                                                name={s.name}
                                                type={s.type}
                                                autoComplete={s.name}
                                                value={formData[s.name]}
                                                onChange={(ev) => {
                                                    handleValid(ev); // Call handleValid first
                                                    setUser({ ...user, [s.name]: ev.target.value }); // Then update user state
                                                }}
                                                error={errors[s.name] !== undefined}
                                                helperText={errors[s.name] || ''}
                                            />
                                        ) : ''} {/* Render null if s.name is 'password' */}
                                    </Grid>
                                ))}
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={!isFormValid} >
                                Save
                            </Button>
                        </Box>
                    </Box>
                </Container>
            ) : (
                ''
            )}
            <br /> <br /> <br /> <br />
        </>
    );
}
