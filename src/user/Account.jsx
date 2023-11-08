import React, { useContext, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
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
import { GeneralContext } from '../App';
import { clientStructure } from './Signup';
import { useNavigate } from 'react-router-dom';
const modifiedClientStructure = clientStructure.map((item) =>
  item.name === 'email' ? { ...item, block: true } : item);

export default function EditAccount() {
  const { user, setUser, setLoader,snackbar } = useContext(GeneralContext);
  const navigate = useNavigate();
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
    // When the user data is available, populate the form data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        middleName: user.middleName || '',
        lastName: user.lastName || '',
        email: user.email || '',
       // You may or may not include password editing
        phone: user.phone || '',
        imgUrl: user.imgUrl || '',
        imgAlt: user.imgAlt || '',
        state: user.state || '',
        country: user.country || '',
        city: user.city || '',
        street: user.street || '',
        houseNumber: user.houseNumber || '',
        zip: user.zip || '',
        business: user.business || false,
      });
    }
  }, [user]);
  const [isFormValid, setIsFormValid] = useState(true); // Assuming the form starts as valid
  const [errors, setErrors] = useState({});
  const schema = Joi.object({
    firstName: Joi.string().min(2),
    middleName: Joi.allow(),
    lastName: Joi.string().min(2),
    email: Joi.string().email({ tlds: false }).required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
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

  const handleSubmit = (ev) => {
    ev.preventDefault();
    // Prepare the data to be sent to the server
    const obj = { ...formData };
    setLoader(true);
    // Make an API call to update the user's account
    fetch(`https://api.shipap.co.il/clients/update?token=d29617f9-3431-11ee-b3e9-14dda9d4a5f0`, {
      credentials: 'include',
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(obj),
    })
      .then(() => {
        setLoader(false);
        // You can redirect or update state as needed after successful update
        navigate('/');
        snackbar('Your Account Was Updated!')
      })
      .catch((err) => {
        console.error(err);
        setLoader(false);
        // Handle error here
      });
  };
  return (
    <>
      {user ? (
        <Container  component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{m:1, bgcolor: 'primary.main',width:'200px',height:'200px' }}>
              <img className='profile-img'  src={user.imgUrl.length>0?user.imgUrl:'https://srcwap.com/wp-content/uploads/2022/08/blank-profile-picture-hd-images-photo.jpg'} alt={user.imgAlt} />
            </Avatar>
            <Typography component="h1" variant="h5">
              Edit Account
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                {modifiedClientStructure.map((s) => (
                  <Grid key={s.name} item sm={s.block ? 12 : 6}>
                    {s.type === 'boolean' ? (
                      <FormControlLabel style={{marginTop:'25px'}}
                        control={
                          <Switch
                            color="primary"
                            name={s.name}
                            checked={formData[s.name]}
                            onChange={()=>alert('User type are not allowed to be Changed by the user, you can contact the admin for this changes.')}
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
              disabled={!isFormValid}
              >
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
