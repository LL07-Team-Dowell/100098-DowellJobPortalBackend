# from django.test import TestCase
# import requests
# import json
# def get_subproject():
#     url = "https://100098.pythonanywhere.com/settingusersubproject/"

#     try:
#         response = requests.get(url)
#         response.raise_for_status()  
#         data = response.json()  
#         return data
#     except requests.exceptions.RequestException as e:
#         print(f"Error: {e}")
#         return None
# # Create your tests here.

# def datacube_data_insertion(api_key,database_name,collection_name,data):

#     url = "https://datacube.uxlivinglab.online/db_api/crud/"

#     data = {
#         "api_key": api_key,
#         "db_name": database_name,
#         "coll_name": collection_name,
#         "operation": "insert",
#         "data":data
        
#     }

#     response = requests.post(url, json=data)
#     return response.text


# def agenda_suprojects():
    
#         unique_subprojects = set()
#         new_project_list=[]

#         subproject_response=get_subproject()

#         for subproject in subproject_response["data"]:
#             if subproject['company_id'] == "6385c0f18eca0fb652c94561":
#                 unique_subprojects.update(subproject["sub_project_list"])
#                 if subproject["parent_project"] not in new_project_list and subproject["data_type"] != "Archived_Data":
#                     new_project_list.append(subproject)
        
#         subproject_list = list(unique_subprojects)

#         for project in new_project_list:
#             project["sub_project_list"]=[subproject.replace(" ","-") for subproject in project["sub_project_list"]]
#         total_data_inserted=0
#         uninsserted_projectname=[]
#         # print(new_project_list)
#         for project in new_project_list:
#             response=datacube_data_insertion(api_key="1b834e07-c68b-4bf6-96dd-ab7cdc62f07f",database_name="WeeklyAgendaReport",collection_name="All_Projects",data=project)
#             print(response)
#             if response:
#                 total_data_inserted +=1
#             else:
#                 uninsserted_projectname.append(project)

#         print(response)
#         print(total_data_inserted)
#         print(uninsserted_projectname)


# agenda_suprojects()