import { HTTPError } from 'got';
import { QueryError, QueryResult,  QueryService} from '@tooljet-plugins/common'


import got from 'got'

export default class GraphqlQueryService implements QueryService {
  async run(sourceOptions: any, queryOptions: any, dataSourceId: string): Promise<QueryResult> {
    let result = {};

    const url = sourceOptions.url;
    const query = queryOptions.query;
    const headers = Object.fromEntries(sourceOptions['headers']);
    const searchParams = Object.fromEntries(sourceOptions['url_params']);

    // Remove invalid headers from the headers object
    Object.keys(headers).forEach((key) => (headers[key] === '' ? delete headers[key] : {}));

    const json = {
      query,
    };

    try {
      const response = await got(url, {
        method: 'post',
        headers,
        searchParams,
        json,
      });
      result = JSON.parse(response.body);
    } catch (error) {
      console.log(error);
      if (error instanceof HTTPError) {
        result = {
          code: error.code,
        };
      }
      throw new QueryError('Query could not be completed', error.message, result);
    }

    return {
      status: 'ok',
      data: result,
    };
  }
}
