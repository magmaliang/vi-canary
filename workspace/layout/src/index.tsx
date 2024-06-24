import { configure } from "mobx";
configure({isolateGlobalState: true})
import "./style.scss";
import 'amis/lib/themes/cxd.css';
import 'amis/lib/helper.css';
import 'amis/sdk/iconfont.css';

import React from "react";
import { createRoot } from 'react-dom/client';
import {render as renderAmis} from 'amis';
import "./neoLayout/gridLayout";

import "./neoLayout/nineGrid/how2use";


import axios from 'axios';

import {ToastComponent, AlertComponent, alert, confirm, toast} from 'amis-ui';

class MyComponent extends React.Component<any, any> {
  render() {
    let theme = 'cxd';
    let locale = 'zh-CN';

    // 请勿使用 React.StrictMode，目前还不支持
    return (
      <div>
        <ToastComponent
          theme={theme}
          key="toast"
          position={'top-right'}
          locale={locale}
        />
        <AlertComponent theme={theme} key="alert" locale={locale} />
        {renderAmis(
          {
            type: "myCustomPage"
          },
          {},
          {
            // 下面三个接口必须实现
            fetcher: ({
              url, // 接口地址
              method, // 请求方法 get、post、put、delete
              data, // 请求数据
              responseType,
              config, // 其他配置
              headers // 请求头
            }: any) => {
              config = config || {};
              config.withCredentials = true;
              responseType && (config.responseType = responseType);

              if (config.cancelExecutor) {
                config.cancelToken = new (axios as any).CancelToken(
                  config.cancelExecutor
                );
              }

              config.headers = headers || {};

              if (method !== 'post' && method !== 'put' && method !== 'patch') {
                if (data) {
                  config.params = data;
                }

                return (axios as any)[method](url, config);
              } else if (data && data instanceof FormData) {
                config.headers = config.headers || {};
                config.headers['Content-Type'] = 'multipart/form-data';
              } else if (
                data &&
                typeof data !== 'string' &&
                !(data instanceof Blob) &&
                !(data instanceof ArrayBuffer)
              ) {
                data = JSON.stringify(data);
                config.headers = config.headers || {};
                config.headers['Content-Type'] = 'application/json';
              }

              return (axios as any)[method](url, data, config);
            },
            isCancel: (value: any) => (axios as any).isCancel(value),
            theme
          }
        )}
      </div>
    );
  }
}


const container = document.getElementById('app-container');
const root = createRoot(container);
root.render(<MyComponent></MyComponent>);

