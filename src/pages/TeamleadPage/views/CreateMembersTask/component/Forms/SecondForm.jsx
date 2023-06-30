import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCurrentUserContext } from '../../../../../../contexts/CurrentUserContext';
import { toast } from 'react-toastify';
import CreateTeamChoice from '../smallComponents/CreateTeamChoice';
import Teams from '../Teams';
import CreateTeam from '../smallComponents/CreateTeam';
import EditTeam1 from '../smallComponents/EditTeam';
import CreateTask from '../smallComponents/CreateTask';
import { EditTeam } from '../../../../../../services/createMembersTasks';
import { initialState } from '../../context/Values';
import { useValues } from '../../context/Values';

const SecondForm = () => {
  const { currentUser } = useCurrentUserContext();
  const { data, setdata } = useValues();
  const [task, settask] = useState({ choosed: false, value: '' });
  const [choosedTeam, setChoosedTeam] = useState({ choosed: false, value: '', id: null });
  const [loading, setloading] = useState(false);
  const [projectname, setprojectname] = useState('');
  const [singlemembertask, setsinglemembertask] = useState('');
  const [toggleCheckboxes, settoggleCheckboxes] = useState(false);

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setdata({ ...data, selected_members: [...data.selected_members, value] });
    } else {
      setdata({ ...data, selected_members: data.selected_members.filter((box) => box !== value) });
    }
  };

  const handleCheckboxChange2 = (event) => {
    const value = event.target.value;
    if (event.target.checked) {
      setdata({ ...data, selected_members: [value] });
    } else {
      setdata({ ...data, selected_members: [] });
    }
  };

  const changeTeamName = (e) => {
    setdata({ ...data, team_name: e.target.value });
  };

  const selectAll = () => {
    setdata({ ...data, selected_members: data.members.map((member) => member) });
  };

  useEffect(() => {
    if (choosedTeam.value) {
      setdata({
        ...data,
        membersEditTeam: [...data.TeamsSelected.find((v) => v.team_name === choosedTeam.value).members],
      });
    }
  }, [choosedTeam]);

  const createSingleMemberTask = () => {
    axios
      .post('https://100098.pythonanywhere.com/task_management/create_task/', {
        project: [projectname],
        applicant: data.selected_members[0],
        task: singlemembertask,
        task_added_by: currentUser.userinfo.username,
        company_id: currentUser.portfolio_info[0].org_id,
        data_type: currentUser.portfolio_info[0].data_type,
        task_created_date: new Date().toString(),
      })
      .then((resp) => {
        setdata({ ...initialState, RESP_INDV_TASK: 'Response', TeamsSelected: data.TeamsSelected });
        toast('Task created');
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const patchTeam = () => {
    const id = data.TeamsSelected.find((m) => m.team_name === choosedTeam.value)['id'];
    const teamName = data.TeamsSelected.find((m) => m.team_name === choosedTeam.value)['team_name'];
    EditTeam(choosedTeam.id, {
      team_name: teamName,
      members: data?.membersEditTeam,
    })
      .then((resp) => {
        toast(`Members of team ${teamName} have been updated!`);
        setdata({ ...initialState, RESP_INDV_TASK: 'Response', TeamsSelected: data.TeamsSelected });
      })
      .catch((err) => {
        console.log(err);
        console.log({ team: data?.membersEditTeam });
      });
  };

  if (loading) return <h1>Loading...</h1>;

  return (
    <div>
      {data.team_task ? (
        <>
          {!task.choosed ? (
            <>
              <CreateTeamChoice settask={settask} />
            </>
          ) : (
            <>
              {task.value === 'new Team' ? (
                <CreateTeam
                  toggleCheckboxes={toggleCheckboxes}
                  settoggleCheckboxes={settoggleCheckboxes}
                  changeTeamName={changeTeamName}
                  handleCheckboxChange={handleCheckboxChange}
                  data={data}
                />
              ) : (
                <>
                  {!choosedTeam.choosed ? (
                    <Teams setChoosedTeam={setChoosedTeam} />
                  ) : (
                    <EditTeam1 choosedTeam={choosedTeam} data={data} patchTeam={patchTeam} />
                  )}
                </>
              )}
            </>
          )}

          <br />
        </>
      ) : (
        <CreateTask
          toggleCheckboxes={toggleCheckboxes}
          data={data}
          settoggleCheckboxes={settoggleCheckboxes}
          handleCheckboxChange2={handleCheckboxChange2}
          createSingleMemberTask={createSingleMemberTask}
          projectname={projectname}
          setprojectname={setprojectname}
          singlemembertask={singlemembertask}
          setsinglemembertask={setsinglemembertask}
        />
      )}
    </div>
  );
};

export default SecondForm;
