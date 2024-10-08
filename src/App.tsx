import React, { useState, useEffect } from 'react';
import { Table, BarChart } from 'lucide-react';
import axios from 'axios';
import { getTokenWithMd5 } from './utils/tokenUtils';

interface StoreData {
  storeName: string;
  city: string;
  customerNum: number;
  teleUserName: string;
}

function App() {
  const [storeData, setStoreData] = useState<StoreData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const account = "Vzan1716574665";
        const text = "d22915e21a9146acb6aeb327fb2430db";
        const authorization = await getTokenWithMd5(account, text);

        const responses = await Promise.all([
          axios.post('https://live-gw.vzan.com/health/v1/admin/agent/store/getList', {
            pageIndex: 1,
            zbId: 1716574665,
            title: "",
            provinceCode: "",
            cityCode: "",
            areaCode: "",
            area: "",
            queryType: "0",
            locationStatus: -1,
            groupId: 0
          }, {
            headers: {
              'accept': 'application/json, text/plain, */*',
              'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
              'authorization': authorization,
              'content-type': 'application/json;charset=UTF-8',
            }
          }),
          axios.post('https://live-gw.vzan.com/health/v1/admin/agent/store/getList', {
            pageIndex: 2,
            zbId: 1716574665,
            title: "",
            provinceCode: "",
            cityCode: "",
            areaCode: "",
            area: "",
            queryType: "0",
            locationStatus: -1,
            groupId: 0
          }, {
            headers: {
              'accept': 'application/json, text/plain, */*',
              'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
              'authorization': authorization,
              'content-type': 'application/json;charset=UTF-8',
            }
          })
        ]);

        const allData = [...responses[0].data.dataObj.rows, ...responses[1].data.dataObj.rows];
        const formattedData = allData.map(item => ({
          storeName: item.storeName,
          city: item.city,
          customerNum: item.customerNum,
          teleUserName: item.teleUserName
        }));

        setStoreData(formattedData.sort((a, b) => b.customerNum - a.customerNum));
        setIsLoading(false);
      } catch (err) {
        setError('数据加载失败，请稍后再试');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">加载中...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">三期各门店吸粉数据</h1>
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Table className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            <h2 className="text-lg sm:text-xl font-semibold">门店数据表格</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-2 sm:px-4 py-2 text-left text-sm sm:text-base">门店名称</th>
                <th className="px-2 sm:px-4 py-2 text-left text-sm sm:text-base">城市</th>
                <th className="px-2 sm:px-4 py-2 text-left text-sm sm:text-base">客户数量</th>
                <th className="px-2 sm:px-4 py-2 text-left text-sm sm:text-base">负责人</th>
              </tr>
            </thead>
            <tbody>
              {storeData.map((store, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-2 sm:px-4 py-2 text-sm sm:text-base">{store.storeName}</td>
                  <td className="px-2 sm:px-4 py-2 text-sm sm:text-base">{store.city}</td>
                  <td className="px-2 sm:px-4 py-2 text-sm sm:text-base">{store.customerNum}</td>
                  <td className="px-2 sm:px-4 py-2 text-sm sm:text-base">{store.teleUserName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <BarChart className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          <h2 className="text-lg sm:text-xl font-semibold">客户数量图表</h2>
        </div>
        <div className="h-64 sm:h-96">
          {storeData.map((store, index) => (
            <div key={index} className="flex items-center mb-2">
              <div className="w-1/3 sm:w-1/4 text-right pr-2 sm:pr-4 text-xs sm:text-sm truncate">{store.storeName}</div>
              <div className="w-2/3 sm:w-3/4">
                <div
                  className="bg-blue-500 h-4 sm:h-6 rounded"
                  style={{ width: `${(store.customerNum / Math.max(...storeData.map(s => s.customerNum))) * 100}%` }}
                ></div>
              </div>
              <div className="ml-1 sm:ml-2 text-xs sm:text-sm">{store.customerNum}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;