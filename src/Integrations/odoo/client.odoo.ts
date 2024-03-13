//import { XmlRpcClient } from '@foxglove/xmlrpc';
import { odooUrl } from './credentials';
import * as xmlrpc from 'xmlrpc';
import 'dotenv/config';

const clientAuthUrl = `${odooUrl}/xmlrpc/2/common`;
const clientActionsUrl = `${odooUrl}/xmlrpc/2/object`;
export const OdooAuthClient = xmlrpc.createClient(clientAuthUrl);
export const OdooActionsClient = xmlrpc.createClient(clientActionsUrl);