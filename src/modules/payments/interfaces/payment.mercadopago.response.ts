export interface GetPaymentResponse {
  ok: true;
  data: Payment;
}

export interface Payment {
  accounts_info: null;
  acquirer_reconciliation: any[];
  additional_info: AdditionalInfo;
  authorization_code: null;
  binary_mode: boolean;
  brand_id: null;
  build_version: string;
  call_for_authorize_id: null;
  captured: boolean;
  card: Card;
  charges_details: ChargesDetail[];
  charges_execution_info: ChargesExecutionInfo;
  collector_id: number;
  corporation_id: null;
  counter_currency: null;
  coupon_amount: number;
  currency_id: string;
  date_approved: Date;
  date_created: Date;
  date_last_updated: Date;
  date_of_expiration: null;
  deduction_schema: null;
  description: string;
  differential_pricing_id: null;
  external_reference: null;
  fee_details: FeeDetail[];
  financing_group: null;
  id: number;
  installments: number;
  integrator_id: null;
  issuer_id: string;
  live_mode: boolean;
  marketplace_owner: null;
  merchant_account_id: null;
  merchant_number: null;
  metadata: TopLevelMetadata;
  money_release_date: Date;
  money_release_schema: null;
  money_release_status: string;
  notification_url: string;
  operation_type: string;
  order: Order;
  payer: Payer;
  payment_method: PaymentMethod;
  payment_method_id: string;
  payment_type_id: string;
  platform_id: null;
  point_of_interaction: PointOfInteraction;
  pos_id: null;
  processing_mode: string;
  refunds: any[];
  release_info: null;
  shipping_amount: number;
  sponsor_id: null;
  statement_descriptor: null;
  status: string;
  status_detail: string;
  store_id: null;
  tags: null;
  taxes_amount: number;
  transaction_amount: number;
  transaction_amount_refunded: number;
  transaction_details: TransactionDetails;
  api_response: APIResponse;
}

export interface AdditionalInfo {
  ip_address: string;
  items: Item[];
  tracking_id: string;
}

export interface Item {
  id: string;
  quantity: string;
  title: string;
  unit_price: string;
}

export interface APIResponse {
  status: number;
  headers: { [key: string]: string[] };
}

export interface Card {}

export interface ChargesDetail {
  accounts: Accounts;
  amounts: Amounts;
  client_id: number;
  date_created: Date;
  id: string;
  last_updated: Date;
  metadata: ChargesDetailMetadata;
  name: string;
  refund_charges: any[];
  reserve_id: null;
  type: string;
  external_charge_id?: string;
}

export interface Accounts {
  from: string;
  to: string;
}

export interface Amounts {
  original: number;
  refunded: number;
}

export interface ChargesDetailMetadata {
  source: string;
  source_detail: string;
  reason?: string;
}

export interface ChargesExecutionInfo {
  internal_execution: InternalExecution;
}

export interface InternalExecution {
  date: Date;
  execution_id: string;
}

export interface FeeDetail {
  amount: number;
  fee_payer: string;
  type: string;
}

export interface TopLevelMetadata {
  delivery_carrier_id: number;
  user_id: number;
  address_id: number;
}

export interface Order {
  id: string;
  type: string;
}

export interface Payer {
  email: string;
  entity_type: null;
  first_name: null;
  id: string;
  identification: Identification;
  last_name: null;
  operator_id: null;
  phone: Phone;
  type: null;
}

export interface Identification {
  number: string;
  type: string;
}

export interface Phone {
  number: null;
  extension: null;
  area_code: null;
}

export interface PaymentMethod {
  id: string;
  issuer_id: string;
  type: string;
}

export interface PointOfInteraction {
  application_data: ApplicationData;
  business_info: BusinessInfo;
  location: Location;
  transaction_data: TransactionData;
  type: string;
}

export interface ApplicationData {
  name: string;
  operating_system: null;
  version: string;
}

export interface BusinessInfo {
  branch: string;
  sub_unit: string;
  unit: string;
}

export interface Location {
  source: string;
  state_id: string;
}

export interface TransactionData {
  e2e_id: null;
}

export interface TransactionDetails {
  acquirer_reference: null;
  external_resource_url: null;
  financial_institution: null;
  installment_amount: number;
  net_received_amount: number;
  overpaid_amount: number;
  payable_deferral_period: null;
  payment_method_reference_id: null;
  total_paid_amount: number;
}
