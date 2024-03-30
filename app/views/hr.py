from .imports import *
# api for hr management starts here______________________
@method_decorator(csrf_exempt, name="dispatch")
class hr_shortlisted_candidate(APIView):
    def post(self, request):
        data = request.data
        error_message = "candidate shortlisting action failed"
        success_message = "candidate has been shortlisted successfully"
        if not data:
            return Response(success=False, message=error_message, response="'request' parameters are not valid, they are None",status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ShortlistSerializer(data=data)
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

        # Response block
        error ='Thread Execution failed'
        if all(not thread.is_alive() for thread in threads):
            error =json.loads(c_r[0])
            # print(json.loads(c_r))
            if json.loads(c_r[0])["isSuccess"] == True:
                return  Response(success=True, message=success_message, response=json.loads(c_r[0]),status=status.HTTP_201_CREATED)   
        return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
            

@method_decorator(csrf_exempt, name="dispatch")
class hr_selected_candidate(APIView):
    def post(self, request):
        data = request.data
        error_message = "candidate selection failed"
        success_message = "candidate has been selected successfully"
        if not data:
            return Response(success=False, message=error_message, response="'request' parameters are not valid, they are None",status=status.HTTP_400_BAD_REQUEST)
        
        serializer = SelectSerializer(data=data)
        if not serializer.is_valid():
            error = {field_name: field_errors[0] if isinstance(field_errors, list) else [field_errors] for field_name, field_errors in serializer.errors.items()}
            return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)

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
  

@method_decorator(csrf_exempt, name="dispatch")
class hr_reject_candidate(APIView):
    def post(self, request):
        data = request.data
        error_message = "Candidate rejection failed"
        success_message = "Candidate has been rejected successfully"
        
        if not data:
            return Response(success=False, message=error_message, response="'request' parameters are not valid, they are None",status=status.HTTP_400_BAD_REQUEST)
        
        serializer=RejectSerializer(data=request.data)
        if not serializer.is_valid():
            error = {field_name: field_errors[0] if isinstance(field_errors, list) else [field_errors] for field_name, field_errors in serializer.errors.items()}
            return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
        field = {
            "_id": data.get("document_id"),
        }
        update_field = {
            "reject_remarks": data.get("reject_remarks"),
            "status": "Rejected",
            "data_type": data.get("data_type"),
            "rejected_on": data.get("rejected_on"),
        }
        insert_to_hr_report = {
            "company_id": data.get("company_id"),
            "applicant": data.get("applicant"),
            "username": data.get("username"),
            "reject_remarks": data.get("reject_remarks"),
            "status": "Rejected",
            "data_type": data.get("data_type"),
            "rejected_on": data.get("rejected_on"),
        }

        c_r = []
        h_r = []

        def call_dowellconnection(*args):
            d = dowellconnection(*args)
            if "candidate_reports" in args:
                c_r.append(d)
            if "hr_reports" in args:
                h_r.append(d)

        arguments = [
            (*candidate_management_reports, "update", field, update_field),
            (*hr_management_reports, "insert", insert_to_hr_report,None),
        ]

        threads = []

        for arg in arguments:
            thread = threading.Thread(target=call_dowellconnection, args=(arg))
            thread.start()
            threads.append(thread)
        
        for thread in threads:
            thread.join()
        
        error = 'Thread Execution failed'
        if all(not thread.is_alive() for thread in threads):
            error = json.loads(c_r[0])
            if json.loads(c_r[0])["isSuccess"] == True:
                return Response(success=True, message=success_message, response=json.loads(c_r[0]), status=status.HTTP_201_CREATED)
        
        return Response(success=False, message=error_message, response=error, status=status.HTTP_400_BAD_REQUEST)
