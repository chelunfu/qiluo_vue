import request from '@/axios'
import type {
  AnalysisTotalTypes,
  UserAccessSource,
  WeeklyUserActivity,
  MonthlySales
} from './types'

export enum DashBoardAnalyApi {
  getCount = '/sys/dashboard/analysis/total',
  getUserAccessSource = '/sys/dashboard/analysis/userAccessSource',
  getWeeklyUserActivity = '/sys/dashboard/analysis/weeklyUserActivity',
  getMonthlySales = '/sys/dashboard/analysis/monthlySales'
}

export const getCountApi = (): Promise<IResponse<AnalysisTotalTypes[]>> => {
  return request.get({ url: DashBoardAnalyApi.getCount })
}

export const getUserAccessSourceApi = (): Promise<IResponse<UserAccessSource[]>> => {
  return request.get({ url: DashBoardAnalyApi.getUserAccessSource })
}

export const getWeeklyUserActivityApi = (): Promise<IResponse<WeeklyUserActivity[]>> => {
  return request.get({ url: DashBoardAnalyApi.getWeeklyUserActivity })
}

export const getMonthlySalesApi = (): Promise<IResponse<MonthlySales[]>> => {
  return request.get({ url: DashBoardAnalyApi.getMonthlySales })
}
