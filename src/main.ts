import * as core from '@actions/core';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';

async function run(): Promise<void> {
  try {
      const connection_string = core.getInput('connection_string');
      const sas_token = core.getInput('sas_token');
      const container_name = core.getInput('container_name');
      const account_name = core.getInput('account_name');
      const blob_name = core.getInput('blob_name');
        core.setOutput('exists', true);
      let blob_service_client: BlobServiceClient;
      if (connection_string) {
        blob_service_client = BlobServiceClient.fromConnectionString(connection_string);
      } else if (sas_token) {
        if (account_name) {
          const shared_key_credential = new StorageSharedKeyCredential(account_name, sas_token);
          blob_service_client = new BlobServiceClient(`https://${account_name}.blob.core.windows.net`, shared_key_credential);
        } else {
          throw new Error('account_name is required if sas_token is provided');
        }
      } else {
        throw new Error('connection_string or sas_token is required');
      }
      const container_client = blob_service_client.getContainerClient(container_name);
      const blob_client = container_client.getBlobClient(blob_name);
      const exists = await blob_client.exists();
      core.setOutput('exists', exists);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}
run();