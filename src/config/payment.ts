import axiosClient from "./client";
import { PaymentDTO } from "./pi";
import { PaymentDataType } from "../types";
import logger from '../../logger.config.mjs';

const config = {headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}};

export const onIncompletePaymentFound = (payment: PaymentDTO) => {
  return axiosClient.post('/payments/incomplete', {payment}, config);
}

export const payWithPi = async (paymentData: PaymentDataType, onComplete:any, onFail:any) => {
  const onReadyForServerApproval = (paymentId: string) => {
    axiosClient.post('/payments/approve', {paymentId}, config);
  }

  const onReadyForServerCompletion = (paymentId: string, txid: string) => {
    axiosClient.post('/payments/complete', { paymentId, txid }, config).then((res) => {
      logger.info('Payment completed successfully: ', res.data);
      onComplete(res.data);
    }).catch((error) => {
      logger.error('Error completing payment: ', error);
      error(error);
    });
  }

  const onCancel = (paymentId: string) => {
    axiosClient.post('/payments/cancelled-payment', { paymentId }, config).then((res)=>{
      onComplete(res.data);
    }).catch((error) => {
      logger.error('Error completing payment: ', error);
      onFail(error);
    });
    
    return 
  }

  const onError = (error: Error, paymentDTO?: PaymentDTO) => {
    if (paymentDTO) {
      return axiosClient.post('/payments/error', { paymentDTO, error }, config).then((res)=>{
        onComplete(res.data);
      }).catch((error) => {
        logger.error('Error completing payment: ', error);
        onFail(error);
      });
    }
  }

  const callbacks = {    
    onReadyForServerApproval,
    onReadyForServerCompletion,
    onIncompletePaymentFound,
    onCancel,
    onError
  };

  const paymentId = await window.Pi.createPayment(
    paymentData, 
    {...callbacks}    
  );

  logger.info('created new payment Id: ', paymentId);

  return paymentId;
}