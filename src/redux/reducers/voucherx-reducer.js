import { REQUEST_VOUCHER, STOP_VOUCHER_REQUEST, RECEIVE_VOUCHER, RECEIVE_EXTRA_VOUCHER, RECEIVE_DETAIL_VOUCHER, RECEIVE_GIFT_VOUCHERS } from "../actions/voucherx-actions/types"

const initStateVoucher = {
    items: [],
    giftItems: [],
    detailVouchers: [],
    isFetching: false,
    page: -1,
    maxPage: 0
}
export const addVoucher = voucher => ({type: RECEIVE_EXTRA_VOUCHER, voucher}) 


export const voucherxReducer = (state = initStateVoucher, action) => {
    switch (action.type) {
        case REQUEST_VOUCHER:
            return { ...state, isFetching: true }
        case STOP_VOUCHER_REQUEST:
            return { ...state, isFetching: false }
        case RECEIVE_VOUCHER:
            return {
                maxPage: state.maxPage,
                page: 9999,
                isFetching: false,
                items: action.vouchers,
                lastUpdated: action.receivedAt
            }
        case RECEIVE_EXTRA_VOUCHER:
            return {
                ...state,
                isFetching: false,
                items: [...state.items, action.voucher],
                lastUpdated: action.receivedAt
            }
        case RECEIVE_DETAIL_VOUCHER: 
            return {
                ...state,
                isFetching: false,
                detailCombo: [...action.vouchers],
                lastUpdated: action.receivedAt
            }
        case RECEIVE_GIFT_VOUCHERS:
            return {
                ...state,
                giftItems: [...action.vouchers]
            }
        default:
            return state
    }
}