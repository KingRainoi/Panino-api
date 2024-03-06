//import { XmlRpcClient } from '@foxglove/xmlrpc';
import { odooUrl } from './credentials';
import * as xmlrpc from 'xmlrpc';

const clientAuthUrl = `${odooUrl}/xmlrpc/2/common`;
const clientActionsUrl = `${odooUrl}/xmlrpc/2/object`;
//export const OdooAuthClient = new XmlRpcClient(clientAuthUrl);
//export const OdooActionsClient = new XmlRpcClient(clientActionsUrl);

export const OdooAuthClient = xmlrpc.createSecureClient(clientAuthUrl);
export const OdooActionsClient = xmlrpc.createSecureClient(clientActionsUrl);