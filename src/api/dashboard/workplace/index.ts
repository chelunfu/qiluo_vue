import request from '@/axios'
import type { WorkplaceTotal, Project, Dynamic, Team, RadarData } from './types'

export enum DashBoardWorkApi {
  getCount = '/sys/dashboard/workplace/total',
  getProject = '/sys/dashboard/workplace/project',
  getDynamic = '/sys/dashboard/workplace/dynamic',
  getTeam = '/sys/dashboard/workplace/team',
  getRadar = '/sys/dashboard/workplace/radar'
}

export const getCountApi = (): Promise<IResponse<WorkplaceTotal>> => {
  return request.get({ url: DashBoardWorkApi.getCount })
}

export const getProjectApi = (): Promise<IResponse<Project>> => {
  return request.get({ url: DashBoardWorkApi.getProject })
}

export const getDynamicApi = (): Promise<IResponse<Dynamic[]>> => {
  return request.get({ url: DashBoardWorkApi.getDynamic })
}

export const getTeamApi = (): Promise<IResponse<Team[]>> => {
  return request.get({ url: DashBoardWorkApi.getTeam })
}

export const getRadarApi = (): Promise<IResponse<RadarData[]>> => {
  return request.get({ url: DashBoardWorkApi.getRadar })
}
