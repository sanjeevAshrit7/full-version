// ** React Imports
import { Fragment, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { Facebook, Twitter, Mail, GitHub, HelpCircle, Coffee, X } from 'react-feather'

// ** Actions
import { handleLogin } from '@store/authentication'

// ** Context
import { AbilityContext } from '@src/utility/context/Can'

// ** Custom Components
import Avatar from '@components/avatar'
import InputPasswordToggle from '@components/input-password-toggle';
import Spinner from '@components/spinner/Loading-spinner'

// ** Utils
import { getHomeRouteForLoggedInUser } from '@utils'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Alert,
  Button,
  CardText,
  CardTitle,
  FormFeedback,
  UncontrolledTooltip
} from 'reactstrap'

// ** Illustrations Imports
import illustrationsLight from '@src/assets/images/pages/login-v2.svg'
import illustrationsDark from '@src/assets/images/pages/login-v2-dark.svg'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import { deployedApiUrl, formatDate, localApiUrl } from '../../../utility/Utils'
import { UserContext } from '../../../utility/context/adminContext'
import { useState } from 'react'
import { isEmpty } from 'lodash'

const ToastContent = ({ t, name, role }) => {
  return (
    <div className='d-flex'>
      <div className='me-1'>
        <Avatar size='sm' color='success' icon={<Coffee size={12} />} />
      </div>
      <div className='d-flex flex-column'>
        <div className='d-flex justify-content-between'>
          <h6>{name}</h6>
          <X size={12} className='cursor-pointer' onClick={() => toast.dismiss(t.id)} />
        </div>
        <span>Hi {name} You have successfully logged in as an {role} user to MyDEN.</span>
      </div>
    </div>
  )
};

const ErrorToastContent = ({ t, meassege }) => {
  return (
    <div className='d-flex'>
      <div className='me-1'>
      </div>
      <div className='d-flex flex-column'>
        <div className='d-flex justify-content-between'>
          <X size={12} className='cursor-pointer' onClick={() => toast.dismiss(t.id)} />
        </div>
        <span className='text-danger'>{meassege}</span>
      </div>
    </div>
  )
}

const defaultValues = {
  password: 'admin@123',
  email: 'admin@gmail.com'
}

const Loader = () => {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        height: '100vh'
      }}>
      <Spinner />
    </div>
  )
};

const Login = () => {
  const initialErrorState = {
    userName: '',
    password: ''
  };

  const payload = {
    userName: 'admin@gmail.com',
    password: 'admin@123',
  };

  // ** Hooks
  const [error, setErrorState] = useState(initialErrorState);
  const [loginDetails, setloginDetails] = useState(payload);
  const [loading, setLoading] = useState(false);

  const { skin } = useSkin()
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const ability = useContext(AbilityContext);
  const { user, setUser } = useContext(UserContext);

  const source = skin === 'dark' ? illustrationsDark : illustrationsLight;

  const callApi = async (body) => {
    let localUrl = `${localApiUrl}/admin/login`;
    let deployedUrl = `${deployedApiUrl}/admin/login`
    // let token = tempToken;
    console.log('body', body)
    await fetch(deployedUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      }
    ).then(async (response) => {
      let res = await response.json();
      console.log('res?.adminLoginResponse?.adminId', res?.adminLoginResponse?.adminId)
      if (res?.adminLoginResponse?.accessToken !== undefined) {
        localStorage.setItem('AdminToken', res?.adminLoginResponse?.accessToken);
        localStorage.setItem('AdminName', loginDetails?.userName)
        setUser({
          name: loginDetails?.userName,
          role: loginDetails?.password,
          email: body?.email,
          mobile: '909090909',
          UserId: res?.adminLoginResponse?.adminId,
          Image: '',
          id: ''
        })
        toast(t => (
          <ToastContent t={t} role={'admin'} name={loginDetails.userName} />
        ))
        setLoading(false);
        navigate(getHomeRouteForLoggedInUser('admin'))
      } else {
        setLoading(false)
        toast(t => (
          <ErrorToastContent t={t} meassege={'Login unsuccesfull... please make sure you have entered the details correctly'} />
        ))
      }
    })
      .catch((error) => {
        console.log('error', error);
      })
  }

  const onSubmit = () => {

    const loginData = {
      "password": "admin",
      "loginEmail": "admin@demo.com"
    };

    const adminPayload = {
      email: loginDetails?.userName,
      password: loginDetails?.password
    }

    if (Object?.values(adminPayload).every(field => field.length > 0)) {
      setLoading(true)
      useJwt
        .login({ email: loginData.loginEmail, password: loginData.password })
        .then(async (res) => {
          const data = { ...res.data.userData, accessToken: res.data.accessToken, refreshToken: res.data.refreshToken }
          dispatch(handleLogin(data))
          ability.update(res.data.userData.ability)
          //calling real admin backend login api
          await callApi(adminPayload)
        })
        .catch((err) => {
          console.log('err', err)
          setError('loginEmail', {
            type: 'manual',
            message: err.response.data.error
          })
          setLoading(false);
        }
        )
    } else {
      setloginDetails(false);
      toast(t => (
        <ErrorToastContent t={t} meassege={'Login unsuccesfull... please make sure you have entered the details correctly'} />
      ))
    }
  }

  if (loading) {
    return (
      <Loader />
    )
  } else {
    return (
      <div className='auth-wrapper auth-cover'>
        <Row className='auth-inner m-0'>
          <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
            <svg viewBox='0 0 139 95' version='1.1' height='28'>
              <defs>
                <linearGradient x1='100%' y1='10.5120544%' x2='50%' y2='89.4879456%' id='linearGradient-1'>
                  <stop stopColor='#000000' offset='0%'></stop>
                  <stop stopColor='#FFFFFF' offset='100%'></stop>
                </linearGradient>
                <linearGradient x1='64.0437835%' y1='46.3276743%' x2='37.373316%' y2='100%' id='linearGradient-2'>
                  <stop stopColor='#EEEEEE' stopOpacity='0' offset='0%'></stop>
                  <stop stopColor='#FFFFFF' offset='100%'></stop>
                </linearGradient>
              </defs>
              <g id='Page-1' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
                <g id='Artboard' transform='translate(-400.000000, -178.000000)'>
                  <g id='Group' transform='translate(400.000000, 178.000000)'>
                    <path
                      d='M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z'
                      id='Path'
                      className='text-primary'
                      style={{ fill: 'currentColor' }}
                    ></path>
                    <path
                      d='M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z'
                      id='Path'
                      fill='url(#linearGradient-1)'
                      opacity='0.2'
                    ></path>
                    <polygon
                      id='Path-2'
                      fill='#000000'
                      opacity='0.049999997'
                      points='69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325'
                    ></polygon>
                    <polygon
                      id='Path-2'
                      fill='#000000'
                      opacity='0.099999994'
                      points='69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338'
                    ></polygon>
                    <polygon
                      id='Path-3'
                      fill='url(#linearGradient-2)'
                      opacity='0.099999994'
                      points='101.428699 0 83.0667527 94.1480575 130.378721 47.0740288'
                    ></polygon>
                  </g>
                </g>
              </g>
            </svg>
            <h2 className='brand-text text-primary ms-1'>My DEN</h2>
          </Link>
          <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
            <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
              <img className='img-fluid' src={source} alt='Login Cover' />
            </div>
          </Col>
          <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
            <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
              <CardTitle tag='h2' className='fw-bold mb-1'>
                Welcome to MyDEN! 👋
              </CardTitle>
              <CardText className='mb-2'>Please sign-in to your account.</CardText>
              <Alert color='primary'>
                <div className='alert-body font-small-2 hidden'>
                  <p>
                    <small className='me-50'>
                      <span className='fw-bold'>Admin:</span> admin@demo.com | admin
                    </small>
                  </p>
                  <p>
                    <small className='me-50'>
                      <span className='fw-bold'>Client:</span> client@demo.com | client
                    </small>
                  </p>
                </div>
              </Alert>
              <div className='mb-1'>
                <Label className='form-label' for='login-email'>
                  Email
                </Label>
                <Input
                  autoFocus
                  type='email'
                  placeholder='john@example.com'
                  value={loginDetails.userName}
                  onChange={(e) => {
                    setloginDetails(prev => ({
                      ...prev,
                      userName: e.target.value,
                    }))
                    let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    e.target.value.match(emailRegex) === null ?
                      setErrorState(prev => ({
                        ...prev,
                        userName: 'Please enter a valid email address'
                      })) :
                      setErrorState(prev => ({
                        ...prev,
                        userName: ''
                      }))
                  }}
                />
                <span className='text-danger'>{error.userName}</span>
              </div>
              <div className='mb-1'>
                <div className='d-flex justify-content-between'>
                  <Label className='form-label' for='login-password'>
                    Password
                  </Label>
                  <Link to='/forgot-password'>
                    <small>Forgot Password?</small>
                  </Link>
                </div>
                <Input
                  autoFocus
                  type='password'
                  placeholder='Enter your password'
                  value={loginDetails.password}
                  onChange={(e) => {
                    setloginDetails(prev => ({
                      ...prev,
                      password: e.target.value,
                    }))
                    isEmpty(e.target.value) ?
                      setErrorState(prev => ({
                        ...prev,
                        password: 'Password cannot be empty'
                      })) :
                      setErrorState(prev => ({
                        ...prev,
                        password: ''
                      }))
                  }}
                />
                <span className='text-danger'>{error.password}</span>
              </div>
              <div className='form-check mb-1'>
                <Input type='checkbox' id='remember-me' />
                <Label className='form-check-label' for='remember-me'>
                  Remember Me
                </Label>
              </div>
              <Button
                color='primary'
                block
                onClick={() => {
                  if (isEmpty(error.userName) && isEmpty(error.password) && !isEmpty(loginDetails?.password) && !isEmpty(loginDetails?.userName)) {
                    onSubmit();
                  } else {
                    toast(t => (
                      <ErrorToastContent t={t} meassege={'Please make sure you have entered the details correctly'} />
                    ))
                  }
                }}
              >
                Sign in
              </Button>
            </Col>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Login
