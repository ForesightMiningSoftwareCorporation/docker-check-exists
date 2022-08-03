# GitHub Action to Check if an Asset exists on Azure Blob Storage

This action is designed to use the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) to upload a directory of your choice to your Azure Blob Storage account.

## Usage

### Example

Place in a `.yml` file such as this one in your `.github/workflows` folder. [Refer to the documentation on workflow YAML syntax here.](https://help.github.com/en/articles/workflow-syntax-for-github-actions)

```yaml
name: Check if Asset Exists On Azure Blob Storage
on:
  push:
    branches:
      - main
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: ForesightMiningSoftwareCorporation/azure-blob-storage-check-exists@main
        with:
          container_name: www
          connection_string: ${{ secrets.ConnectionString }}
          blob_name: my-blob.v2.0.tar.gz
```

### Required Variables

| Key              | Value                                                                      |
|------------------|----------------------------------------------------------------------------|
| `container_name` | The name of the storage account container these assets will be uploaded to |
| `blob_name`      | The name of the blob to check                           |

### Optional Variables

| Key                 | Value                                                                                                                                   |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| `account_name`      | The name of the storage account. Required if `sas_token` is used                                                                        |
| `connection_string` | The connection string for the storage account. Used if value is set. Either `connection_string` or `sas_token` must be supplied         |
| `sas_token`         | The shared access signature token for the storage account. Either connection\_string or sas\_token must be supplied                     |

### Outputs

| Key                 | Value                         | Type |
|---------------------|-------------------------------|------|
| `exists`            | Wether the blob exists or not | bool |

## License

This project is distributed under the [Apache 2 license](LICENSE).
