"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const storage_blob_1 = require("@azure/storage-blob");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection_string = core.getInput('connection_string');
            const sas_token = core.getInput('sas_token');
            const container_name = core.getInput('container_name');
            const account_name = core.getInput('account_name');
            const blob_name = core.getInput('blob_name');
            core.setOutput('exists', true);
            let blob_service_client;
            if (connection_string) {
                blob_service_client = storage_blob_1.BlobServiceClient.fromConnectionString(connection_string);
            }
            else if (sas_token) {
                if (account_name) {
                    const shared_key_credential = new storage_blob_1.StorageSharedKeyCredential(account_name, sas_token);
                    blob_service_client = new storage_blob_1.BlobServiceClient(`https://${account_name}.blob.core.windows.net`, shared_key_credential);
                }
                else {
                    throw new Error('account_name is required if sas_token is provided');
                }
            }
            else {
                throw new Error('connection_string or sas_token is required');
            }
            const container_client = blob_service_client.getContainerClient(container_name);
            const blob_client = container_client.getBlobClient(blob_name);
            const exists = yield blob_client.exists();
            core.setOutput('exists', exists);
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
        }
    });
}
run();
