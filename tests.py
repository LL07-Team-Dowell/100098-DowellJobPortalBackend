from django.test import TestCase
from app.helper import get_subproject

# Create your tests here.
def agenda_suprojects(self, request):
        data=request.GET
        project=request.data.get("project")
        company_id=data.get("company_id")       
        unique_subprojects = set()
        new_project_list=[]

        subproject_response=get_subproject()

        for subproject in subproject_response["data"]:
            if subproject['company_id'] == company_id:
                unique_subprojects.update(subproject["sub_project_list"])
                if subproject["parent_project"] not in new_project_list and subproject["data_type"] != "Archived_Data":
                    new_project_list.append(subproject)
        
        subproject_list = list(unique_subprojects)

        for project in new_project_list:
            project["sub_project_list"]=[subproject.replace(" ","-") for subproject in project["sub_project_list"]]

        print(new_project_list)

agenda_suprojects()