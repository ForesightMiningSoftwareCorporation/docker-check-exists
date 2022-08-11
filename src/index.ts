import * as core from '@actions/core';
import got from 'got';

import { Response } from 'got';

const PAGE_SIZE = 100;

interface ImageListTagResponse {
  name: string;
  tags: string[];
}

export const checkImageExists = async (
  repository: string,
  username: string,
  password: string,
  image_name: string,
  version: string,
): Promise<boolean> => {
  let found = false;
  try {
    const paginated_answer = got.paginate(`https://${repository}/v2/${image_name}/tags/list?n=${PAGE_SIZE}`, {
      username,
      password,
      pagination: {
        transform: (response: Response) => {
          const { tags } = JSON.parse(response.body as string) as ImageListTagResponse;
          return tags;
        },
        shouldContinue: () => !found,
      },
    });
    for await (const tag of paginated_answer) {
      if (tag === version) {
        found = true;
        break;
      }
    }
  } catch (error) {
    console.error(error);
    return false;
  }
  return found;
};

async function run(): Promise<void> {
  try {
    const repository = core.getInput('repository');
    const username = core.getInput('username');
    const password = core.getInput('password');
    const image_name = core.getInput('image_name');
    const version = core.getInput('version');
    core.setOutput('exists', false);
    if (!repository) {
      core.setFailed('repository is required');
      return;
    }
    if (!username) {
      core.setFailed('username is required');
      return;
    }
    if (!password) {
      core.setFailed('password is required');
      return;
    }
    if (!image_name) {
      core.setFailed('image_name is required');
      return;
    }
    if (!version) {
      core.setFailed('version is required');
      return;
    }
    const exists = await checkImageExists(repository, username, password, image_name, version);
    core.setOutput('exists', exists);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}
run();
