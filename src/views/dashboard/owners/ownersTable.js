// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Table, Card, Spinner, Col, CardText } from 'reactstrap'

// ** Icons Imports
import { Monitor, Coffee, Watch, TrendingUp, TrendingDown, ChevronDown } from 'react-feather'

// ** Icons Imports
import starIcon from '@src/assets/images/icons/star.svg'
import bookIcon from '@src/assets/images/icons/book.svg'
import brushIcon from '@src/assets/images/icons/brush.svg'
import rocketIcon from '@src/assets/images/icons/rocket.svg'
import toolboxIcon from '@src/assets/images/icons/toolbox.svg'
import speakerIcon from '@src/assets/images/icons/speaker.svg'
import parachuteIcon from '@src/assets/images/icons/parachute.svg'
import { useEffect } from 'react'
import { useState } from 'react';
import SpinnerGrowColors from '../../components/spinners/SpinnerGrowingColored'
import { isEmpty } from 'lodash'
import { columns, getAllOwners } from './utils'
import DataTable from 'react-data-table-component'

const OwnersTable = (props) => {

    const { userData, setUserData } = props;
    // ** vars
    const [loading, setLoading] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5)

    const colorsArr = {
        Technology: 'light-primary',
        Grocery: 'light-success',
        Fashion: 'light-warning'
    }

    const callOwnersApi = async () => {
        setLoading(true);
        await getAllOwners(setUserData)
            .then(() => {
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            })
    };

    const renderData = () => {
        return userData?.map(col => {
            return (
                <tr key={col.name}>
                    <td>
                        <div className='d-flex align-items-center'>
                            <div className='avatar rounded'>
                                <div className='avatar-content'>
                                    {/* <img src={col.img} alt={col.name} /> */}
                                </div>
                            </div>
                            <div>
                                <div className='fw-bolder'>&nbsp;{col.name}</div>
                                {/* <div className='font-small-2 text-muted'>{col.email}</div> */}
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className='d-flex align-items-center'>
                            {/* <Avatar className='me-1' color={colorsArr[col.category]} icon={col.icon} /> */}
                            <span>{col.unit}</span>
                        </div>
                    </td>
                    <td>{`A`}</td>
                    <td>{col.phone}</td>
                </tr>
            )
        })
    };

    useEffect(() => {
        if (isEmpty(userData)) {
            callOwnersApi();
        } else {
            console.log('userdata exists', userData)
        }
    }, [])

    console.log('userResponse', userData)
    return (
        <>
            {
                loading ?
                    <Col md='6' sm='12'>
                        <SpinnerGrowColors />
                    </Col>
                    :
                    (!isEmpty(userData)) ?
                        <Card className='card-company-table mt-5'>
                            <Table
                                responsive
                            >
                                <thead>
                                    <tr>
                                        <th>Flat owner</th>
                                        <th>Flat/Flats</th>
                                        <th>Wing name</th>
                                        <th>Contact number</th>
                                    </tr>
                                </thead>
                                <tbody>{renderData()}</tbody>
                            </Table>
                        </Card> :
                        <div className='d-flex justify-content-center mt-40'>
                            <p>No Results</p>
                        </div>
            }
        </>
    )
}

export default OwnersTable
