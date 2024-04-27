import { SEPARATION } from '../constants';

// 为git mr 生成唯一key
export const genGitlabPipelineJobUnitKey = (projectId: number, iid: number) =>
  `${projectId}${SEPARATION}${iid}`;

export const parseGitlabPipelineJobUnitKey = (unitKey: string) => {
  const [projectId, iid] = unitKey.split(SEPARATION);
  return {
    projectId: Number(projectId),
    iid: Number(iid),
  };
};
