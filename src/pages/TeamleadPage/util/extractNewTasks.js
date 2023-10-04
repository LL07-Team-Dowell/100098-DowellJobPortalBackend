export const extractNewTasksAndAddExtraDetail = (
  taskDetailsArr,
  tasksArr,
  extraDetail = false,
  allCandidateApplicationData = null
) => {
  const extractedArr = taskDetailsArr
    ?.map((detail) => {
      if (!detail.user_id) return null;

      const foundTasks = tasksArr?.filter(
        (task) => detail._id === task.task_id
      );
      let foundApplicationForUser;

      if (
        allCandidateApplicationData &&
        Array.isArray(allCandidateApplicationData)
      ) {
        foundApplicationForUser = allCandidateApplicationData.find(
          (application) => application.username === detail.task_added_by
        );
      }

      return foundTasks
        .map((foundSingleTask) => {
          if (!foundSingleTask.is_active) return null;

          if (extraDetail) {
            if (foundApplicationForUser)
              return {
                ...detail,
                task: foundSingleTask.task,
                project: foundSingleTask.project,
                user_id: foundSingleTask.user_id,
                task_type: foundSingleTask.task_type,
                start_time: foundSingleTask.start_time,
                end_time: foundSingleTask.end_time,
                task_id: foundSingleTask.task_id,
                single_task_created_date: foundSingleTask.task_created_date,
                subproject: foundSingleTask.subproject,
                applicantName: foundApplicationForUser?.applicant,
                single_task_id: foundSingleTask._id,
                approved: foundSingleTask.approved,
                status: foundSingleTask.status,
              };

            return {
              ...detail,
              task: foundSingleTask.task,
              project: foundSingleTask.project,
              user_id: foundSingleTask.user_id,
              task_type: foundSingleTask.task_type,
              start_time: foundSingleTask.start_time,
              end_time: foundSingleTask.end_time,
              task_id: foundSingleTask.task_id,
              single_task_created_date: foundSingleTask.task_created_date,
              subproject: foundSingleTask.subproject,
              single_task_id: foundSingleTask._id,
              approved: foundSingleTask.approved,
              status: foundSingleTask.status,
            };
          }

          if (foundApplicationForUser)
            return {
              ...detail,
              task: foundSingleTask.task,
              project: foundSingleTask.project,
              subproject: foundSingleTask.subproject,
              applicantName: foundApplicationForUser?.applicant,
              single_task_id: foundSingleTask._id,
            };

          return {
            ...detail,
            task: foundSingleTask.task,
            project: foundSingleTask.project,
            subproject: foundSingleTask.subproject,
            single_task_id: foundSingleTask._id,
          };
        })
        .filter((task) => task);
    })
    .flat()
    .filter((item) => item);

  return extractedArr;
};
