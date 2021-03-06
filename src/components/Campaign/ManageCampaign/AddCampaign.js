import React, { useState, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { Header } from '../../common/Header/Header'
import { Form, Input, DatePicker, Button, Table, message } from 'antd'
import { checkMinMax } from '../../../utils/validate'
import { dateFormat } from '../../../constant'
import moment from 'moment'
import { SelectGiftVouchers } from '../../../redux/container/SelectGiftVouchers'
import { requestAddCampaign } from '../../../redux/actions/campaign-actions/actions'

export const AddCampaign = () => {
    const dispatch = useDispatch();
    const [campaign, setCampaign] = useState({
        campaign_name: '',
        from_date: undefined,
        to_date: undefined,
        description: '',
        vouchers: [],
    })

    const [displayVouchers, setDisplayVouchers] = useState({})
    const vouchersDetail = useMemo(() => {
        let result = Object.values(displayVouchers)
        result = result.reduce((acc, curr) => {
            return [...acc, ...curr]
        }, [])
        return result
    }, [displayVouchers])

    const [visibleSelectVoucherModal, setVisibleSelectVoucherModal] = useState(false)
    const open = () => setVisibleSelectVoucherModal(true)
    const close = (memoSelectVouchers, memoDisplayVouchers) => {
        if (memoSelectVouchers !== undefined) {
            setCampaign({ ...campaign, vouchers: [...memoSelectVouchers] })
            setDisplayVouchers({ ...memoDisplayVouchers })
        }
        setVisibleSelectVoucherModal(false)
    }
    const hasError = useMemo(() => {
        const errors = {
            campaign_name: checkMinMax(campaign.campaign_name.length, 5, 50) === true ? false : true,
            from_to: (campaign.from_date !== undefined && campaign.to_date !== undefined) ? false : true,
            description: checkMinMax(campaign.description.length, 20, 200) === true ? false : true,
            vouchers: checkMinMax(campaign.vouchers.length, 5, 20) === true ? false : true,
        }
        const noErrors = Object.values(errors).every(item => item === false)
        return {
            ...errors,
            noErrors
        }
    }, [campaign])

    const onChangeCampaign = ({ target: { name, value } }) => {
        setCampaign({
            ...campaign,
            [name]: value
        })
    }

    const disabledDate = current => {
        const curr = new Date();
        curr.setDate(curr.getDate() -1 )
        return current && current <= moment(curr).endOf('day')
    }
    const onChangeRangePicker = ([from, to]) => {
        setCampaign({
            ...campaign,
            from_date: from,
            to_date: to
        })
    }

    const onCalendarChange = ([to]) => {
        if (to) {
            setCampaign({
                ...campaign,
                from_date: moment(),
                to_date: to
            })
        }
    }

    const onChangeSelectedVouchers = (selectedRowKeys, selectedRows, filter) => {
        setCampaign({
            ...campaign,
            vouchers: [...selectedRowKeys]
        })
        setDisplayVouchers({
            ...displayVouchers,
            [filter]: [...selectedRows]
        })
    }

    // controll loading effect of button add new campaign
    const [isAdding, setIsAdding] = useState(false)
    // handle add new campaign
    const handleAddCampaign = () => {
        //start loading effect
        setIsAdding(true)
        // send request add campaign
        const to_date =  campaign.to_date.toDate()
        to_date.setHours(23,59,59)
        dispatch(requestAddCampaign({...campaign, to_date}))
            .then(status => {
                switch (status) {
                    case 200:
                        message.success(`${campaign.campaign_name} added`)
                        break;
                    case 11000:
                        message.error(`${campaign.campaign_name} is existed`)
                        break
                    default:
                        message.error(`${campaign.campaign_name} failed`)
                        break;
                }
                setIsAdding(false)
            })
    }

    // config table
    const tableConfig = {
        pagination: false,
        size: 'small',
        rowKey: (record) => record._id,
        scroll: { y: 350 },
    }
    const columns = [
        {
            title: 'Name',
            dataIndex: 'voucher_name',
            key: 'voucher_name',
            width: 100,
        },
        {
            title: 'Service',
            dataIndex: 'subcategory',
            key: 'subcategory',
            width: 100,
        },
        {
            title: 'Rank',
            dataIndex: 'rank',
            key: 'rank',
            width: 100,
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            width: 100,
            sorter: (a, b) => a.value - b.value
        },
        {
            title: 'Persent',
            dataIndex: 'discount',
            key: 'discount',
            width: 100,
            sorter: (a, b) => a.discount - b.discount
        }
    ]

    return (
        <div className="add-campaign">
            <Header className="add-campaign__title" title="Add new campaign" />
            <div className="add-campaign__form">
                <Form layout="vertical">
                    <Form.Item label="Name"
                        help={hasError.campaign_name && "Name must be from 5 to 50 character"}
                        hasFeedback
                        validateStatus={hasError.campaign_name ? 'error' : 'success'}
                    >
                        <Input name="campaign_name" onChange={onChangeCampaign} value={campaign.campaign_name} />
                    </Form.Item>
                    <Form.Item label="Description"
                        help={hasError.description && "Description must be from 20 to 200 character"}
                        validateStatus={hasError.description ? 'error' : 'success'}
                    >
                        <Input.TextArea rows={3} name="description" onChange={onChangeCampaign} value={campaign.description} />
                    </Form.Item>
                    <Form.Item label="Start - End"
                        help={hasError.from_to && "Start date, End date must be not null"}
                        validateStatus={hasError.from_to ? 'error' : 'success'}
                    >
                        <DatePicker.RangePicker
                            disabledDate={disabledDate}
                            onCalendarChange={onCalendarChange}
                            format={dateFormat}
                            onChange={onChangeRangePicker}
                            value={[campaign.from_date, campaign.to_date]}
                        />
                    </Form.Item>
                    <Form.Item
                        help={hasError.vouchers && "Number of vouchers must be from 5 to 20"}
                        validateStatus={hasError.vouchers ? 'error' : 'success'}>
                        <Button onClick={open}>add vouchers</Button>
                        <SelectGiftVouchers
                            selectedVouchers={campaign.vouchers}
                            displayVouchers={displayVouchers}
                            onChangeSelectedVouchers={onChangeSelectedVouchers}
                            isOpenSelectVoucherModal={visibleSelectVoucherModal}
                            handleCloseSelectVoucherModal={close} />
                    </Form.Item>
                    <Form.Item label="Vouchers"

                    >
                        <Table
                            {...tableConfig}
                            dataSource={vouchersDetail.length > 0 ? vouchersDetail : null}
                            columns={columns} />
                    </Form.Item>
                </Form>
            </div>
            <div className="d-flex-center">
                <Button onClick={handleAddCampaign} disabled={!hasError.noErrors} loading={isAdding}>Add</Button>
            </div>
        </div>
    )
}