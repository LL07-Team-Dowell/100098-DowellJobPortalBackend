from .imports import *
# api for hr management starts here______________________
@method_decorator(csrf_exempt, name="dispatch")
class shortlist_candidate(APIView):
    def post(self, request):
        data = request.data
        error_message = "candidate shortlisting action failed"
        success_message = "candidate has been shortlisted successfully"
        if not data:
            return Response(success=False, message=error_message, response="'request' parameters are not valid, they are None",status=status.HTTP_400_BAD_REQUEST)
        serializer = HRSerializer(data=data)
        
        if not serializer.is_valid():
            error = {field_name: field_errors[0] if isinstance(field_errors, list) else [field_errors] for field_name, field_errors in serializer.errors.items()}
            return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)

        field = {
            "_id": data.get("document_id"),
        }
        update_field = {
            "hr_remarks": data.get("hr_remarks"),
            "status": "shortlisted",
            "shortlisted_on": data.get("shortlisted_on"),
        }
        insert_to_hr_report = {
            "event_id": get_event_id()["event_id"],
            "applicant": data.get("applicant"),
            "hr_remarks": data.get("hr_remarks"),
            "status": "shortlisted",
            "company_id": data.get("company_id"),
            "data_type": data.get("data_type"),
            "shortlisted_on": data.get("shortlisted_on"),
        }

        
        
        c_r = []
        h_r = []

        def call_dowellconnection(*args):
            d = dowellconnection(*args)
            # print(d, *args, "=======================")
            if "candidate_report" in args:
                c_r.append(d)
            if "hr_report" in args:
                h_r.append(d)
        
        arguments=[(*candidate_management_reports,'update',field,update_field),
                   (*hr_management_reports,"insert",insert_to_hr_report,None)]
        threads=[]
        for arg in arguments:
            thread = threading.Thread(target=call_dowellconnection,args=(arg))
            thread.start()
            threads.append(thread)

        for thread in threads:
            thread.join()

        print(c_r)
        # Response block
        error ='Thread Execution failed'
        if all(not thread.is_alive() for thread in threads):
            error =json.loads(c_r[0])
            # print(json.loads(c_r))
            if json.loads(c_r[0])["isSuccess"] == True:
                return  Response(success=True, message=success_message, response=json.loads(c_r[0]),status=status.HTTP_201_CREATED)   
        return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)

        # update_response_thread = threading.Thread(
        #     target=call_dowellconnection,
        #     args=(*candidate_management_reports, "update", field, update_field),
        #              (*hr_management_reports, "update", field, update_field),
        # )
        # update_response_thread.start()

        # insert_response_thread = threading.Thread(
        #     target=call_dowellconnection,
        #     args=(
        #         *hr_management_reports,
        #         "insert",
        #         insert_to_hr_report,
        #         update_field,
        #     ),
        # )

        # insert_response_thread.start()
        # update_response_thread.join()
        # insert_response_thread.join()

        # if (
        #     not update_response_thread.is_alive()
        #     and not insert_response_thread.is_alive()
        # ):
        #     if json.loads(c_r[0])["isSuccess"] == True:
        #         return Response(
        #             {
        #                 "message": f"Candidate has been {data.get('status')}",
        #                 "response": json.loads(c_r[0]),
        #             },
        #             status=status.HTTP_201_CREATED,
        #         )
        #     else:
        #         return Response(
        #             {
        #                 "message": "Operation has failed",
        #                 "response": json.loads(c_r[0]),
        #             },
        #             status=status.HTTP_204_NO_CONTENT,
        #         )
        # else:
        #     return Response(
        #         {"message": "Operation has failed"},
        #         status=status.HTTP_304_NOT_MODIFIED,
        #     )
        # else:
        #     default_errors = serializer.errors
        #     new_error = {}
        #     for field_name, field_errors in default_errors.items():
        #         new_error[field_name] = field_errors[0]
        #     return Response(new_error, status=status.HTTP_400_BAD_REQUEST)

            

@method_decorator(csrf_exempt, name="dispatch")
class hr_select_candidate(APIView):
    def post(self, request):
        data = request.data
        error_message = "candidate selection failed"
        success_message = "candidate has been selected successfully"
        if not data:
            return Response(success=False, message=error_message, response="'request' parameters are not valid, they are None",status=status.HTTP_400_BAD_REQUEST)
        field = {
            "_id": data.get("document_id"),
        }
        update_field = {
            "hr_remarks": data.get("hr_remarks"),
            "project": data.get("project"),
            "product_discord_link": data.get("product_discord_link"),
            "status": "selected",
            "selected_on": data.get("selected_on"),
        }
        insert_to_hr_report = {
            "event_id": get_event_id()["event_id"],
            "applicant": data.get("applicant"),
            "hr_remarks": data.get("hr_remarks"),
            "project": data.get("project"),
            "product_discord_link": data.get("product_discord_link"),
            "status": "selected",
            "company_id": data.get("company_id"),
            "data_type": data.get("data_type"),
            "selected_on": data.get("selected_on"),
        }

        c_r = []
        h_r = []

        def call_dowellconnection(*args):
            d = dowellconnection(*args)
            arg = args
            # print(d, *args, "=======================")
            if "candidate_report" in args:
                c_r.append(d)
            if "hr_report" in args:
                h_r.append(d)

        arguments=[(*candidate_management_reports, "update", field, update_field),
                   (*hr_management_reports,"insert",insert_to_hr_report,update_field,)]

        threads=[]

        for arg in arguments:
            thread=threading.Thread(target=call_dowellconnection,args=(arg))
            thread.start()
            threads.append(thread)
        for thread in threads:
            thread.join()

        error ='Thread Execution failed'
        if (not thread.is_alive() for thread in threads):
            error =json.loads(c_r[0])
            if json.loads(c_r[0])["isSuccess"] == True:
                print("True")
                return  Response(success=True, message=success_message, response=json.loads(c_r[0]),status=status.HTTP_201_CREATED)   
            
        return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
  

        # update_response_thread = threading.Thread(
        #     target=call_dowellconnection,
        #     args=(*candidate_management_reports, "update", field, update_field),
        # )
        # update_response_thread.start()

        # insert_response_thread = threading.Thread(
        #     target=call_dowellconnection,
        #     args=(
        #         *hr_management_reports,
        #         "insert",
        #         insert_to_hr_report,
        #         update_field,
        #     ),
        # )

        # insert_response_thread.start()
        # update_response_thread.join()
        # insert_response_thread.join()

        # if (
        #     not update_response_thread.is_alive()
        #     and not insert_response_thread.is_alive()
        # ):
        #     if json.loads(c_r[0])["isSuccess"] == True:
        #         return Response(
        #             {
        #                 "message": f"Candidate has been {data.get('status')}",
        #                 "response": json.loads(c_r[0]),
        #             },
        #             status=status.HTTP_200_OK,
        #         )
        #     else:
        #         return Response(
        #             {
        #                 "message": "Hr Operation has failed",
        #                 "response": json.loads(c_r[0]),
        #             },
        #             status=status.HTTP_204_NO_CONTENT,
        #         )
        # else:
        #     return Response(
        #         {"message": "Hr operation failed"},
        #         status=status.HTTP_304_NOT_MODIFIED,
        #     )



# @method_decorator(csrf_exempt, name="dispatch")
# class hr_reject_candidate(APIView):
#     def post(self, request):
#         data = request.data
#         # print(data)
#         if data:
#             # continue reject api-----
#             field = {
#                 "_id": data.get("document_id"),
#             }
#             update_field = {
#                 "reject_remarks": data.get("reject_remarks"),
#                 "status": "Rejected",
#                 "data_type": data.get("data_type"),
#                 "rejected_on": data.get("rejected_on"),
#             }
#             insert_to_hr_report = {
#                 "company_id": data.get("company_id"),
#                 "applicant": data.get("applicant"),
#                 "username": data.get("username"),
#                 "reject_remarks": data.get("reject_remarks"),
#                 "status": "Rejected",
#                 "data_type": data.get("data_type"),
#                 "rejected_on": data.get("rejected_on"),
#             }

#         serializer = RejectSerializer(data=data)
#         if serializer.is_valid():
#             candidate_report_result = []
#             hr_report_result = []

#             def call_dowellconnection(*args):
#                 try:
#                     result = dowellconnection(*args)
#                     if "candidate_report" in args:
#                         candidate_report_result.append(result)
#                     if "hr_report" in args:
#                         hr_report_result.append(result)
#                 except Exception as e:
#                     # Handle the exception
#                     print(f"Error in call_dowellconnection: {e}")

#             candidate_thread = threading.Thread(
#                 target=call_dowellconnection,
#                 args=(*candidate_management_reports, "update", field, update_field),
#             )
#             candidate_thread.start()

#             hr_thread = threading.Thread(
#                 target=call_dowellconnection,
#                 args=(
#                     *hr_management_reports,
#                     "insert",
#                     insert_to_hr_report,
#                     update_field,
#                 ),
#             )
#             hr_thread.start()

#             candidate_thread.join()
#             hr_thread.join()

#             if not candidate_thread.is_alive() and not hr_thread.is_alive():
#                 if json.loads(candidate_report_result[0])["isSuccess"]:
#                     return Response(
#                         {
#                             "message": f"Candidate has been {insert_to_hr_report['status']}",
#                             "response": json.loads(candidate_report_result[0]),
#                         },
#                         status=status.HTTP_201_CREATED,
#                     )
#                 else:
#                     return Response(
#                         {
#                             "message": "Hr Operation failed",
#                             "response": json.loads(candidate_report_result[0]),
#                         },
#                         status=status.HTTP_204_NO_CONTENT,
#                     )
#             else:
#                 return Response(
#                     {"message": "Hr Operation failed"},
#                     status=status.HTTP_304_NOT_MODIFIED,
#                 )
#         else:
#             default_errors = serializer.errors
#             new_error = {}
#             for field_name, field_errors in default_errors.items():
#                 new_error[field_name] = field_errors[0]
#             return Response(new_error, status=status.HTTP_400_BAD_REQUEST)