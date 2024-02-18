from .imports import *

# apis for account management begins here______________________
@method_decorator(csrf_exempt, name="dispatch")
class accounts_onboard_candidate(APIView):
    def post(self, request):
        data = request.data
        error_message = "Onboarding Candidate failed"
        success_message = "Candidate has been Onboarded"
        if not data:
            return Response(success=False, message=error_message, response="'request' parameters are not valid, they are None",status=status.HTTP_400_BAD_REQUEST)
        
        serializer = AccountSerializer(data=data)
        if not serializer.is_valid():
            error = {field_name: field_errors[0] if isinstance(field_errors, list) else [field_errors] for field_name, field_errors in serializer.errors.items()}
            return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
            
        field = {
            "_id": data.get("document_id"),
        }
        update_field = {
            "status": "hired", 
            "onboarded_on": data.get("onboarded_on"),
        }
        insert_to_hr_report = {
            "event_id": get_event_id()["event_id"],
            "applicant": data.get("applicant"),
            "project": data.get("project"),
            "status": "hired", 
            "company_id": data.get("company_id"),
            "data_type": data.get("data_type"),
            "onboarded_on": update_field['onboarded_on'],
        }

        """using threads for concurrency"""
        #---------------------defining thread functions and variables--------------------------------------------------
        c_r = []
        a_r = []

        def call_dowellconnection(*args):
            d = dowellconnection(*args)
            if "candidate_report" in args:
                c_r.append(d)
            if "account_report" in args:
                a_r.append(d)
        arguments = [(*candidate_management_reports, 'update',field, update_field),
                        (*account_management_reports,"insert",insert_to_hr_report,update_field)]
        
        #---------------------start of threads--------------------------------------------------
        threads=[]
        for arg in arguments:
            thread = threading.Thread(target=call_dowellconnection,args=(arg))
            thread.start()
            threads.append(thread)
        for thread in threads:
            thread.join()
        #---------------------end of threads--------------------------------------------------

        """Response block"""
        error ='Thread Execution failed'
        if (not thread.is_alive() for thread in threads):
            error =json.loads(c_r[0])
            if json.loads(c_r[0])["isSuccess"] == True:
                return  Response(success=True, message=success_message, response=json.loads(c_r[0]),status=status.HTTP_201_CREATED)   
        return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
                   
@method_decorator(csrf_exempt, name="dispatch")
class accounts_update_project(APIView):
    def patch(self, request):
        data = request.data
        error_message = "Updating Candidate project and payment failed"
        success_message = "Candidate project and payment has been updated"
        if not data:
            return Response(success=False, message=error_message, response="'request' parameters are not valid, they are None",status=status.HTTP_400_BAD_REQUEST)
            
        serializer = AccountUpdateSerializer(data=data)
        if not serializer.is_valid():
            error = {field_name: field_errors[0] if isinstance(field_errors, list) else [field_errors] for field_name, field_errors in serializer.errors.items()}
            return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
            
        field = {
            "_id": data.get("document_id"),
        }
        update_field = {
            "payment": data.get("payment"),
            "project": data.get("project"),
        }

        """using threads for concurrency"""
        #---------------------defining thread functions and variables--------------------------------------------------
        c_r = []
        a_r = []

        def call_dowellconnection(*args):
            d = dowellconnection(*args)
            if "candidate_report" in args:
                c_r.append(d)
            if "account_report" in args:
                a_r.append(d)
        arguments = [(*candidate_management_reports, "update", field, update_field),
                        (*account_management_reports, "update", field, update_field)]
        
        #---------------------start of threads--------------------------------------------------
        threads=[]
        for arg in arguments:
            thread = threading.Thread(target=call_dowellconnection,args=(arg))
            thread.start()
            threads.append(thread)
        for thread in threads:
            thread.join()
        #---------------------end of threads--------------------------------------------------
        """Response block"""
        error ='Thread Execution failed'
        if (not thread.is_alive() for thread in threads):
            error =json.loads(c_r[0])
            if json.loads(c_r[0])["isSuccess"] == True:
                return  Response(success=True, message=success_message, response=json.loads(c_r[0]),status=status.HTTP_201_CREATED)   
        return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name="dispatch")
class accounts_rehire_candidate(APIView):
    def post(self, request):
        data = request.data
        error_message = "Rehiring Candidate failed"
        success_message = "Candidate has been Rehired"
        if not data:
            return Response(success=False, message=error_message, response="'request' parameters are not valid, they are None",status=status.HTTP_400_BAD_REQUEST)
            
        serializer = RehireSerializer(data=data)
        if not serializer.is_valid():
            error = {field_name: field_errors[0] if isinstance(field_errors, list) else [field_errors] for field_name, field_errors in serializer.errors.items()}
            return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
            
        field = {
            "_id": data.get("document_id"),
        }
        update_field = {
            "status": "to_rehire",
            "rehired_on": data.get("rehired_on"),
        }

        """using threads for concurrency"""
        #---------------------defining thread functions and variables--------------------------------------------------
        c_r = []
        a_r = []

        def call_dowellconnection(*args):
            d = dowellconnection(*args)
            if "candidate_report" in args:
                c_r.append(d)
            if "account_report" in args:
                a_r.append(d)

        arguments = [(*candidate_management_reports, "update", field, update_field),
                        (*account_management_reports, "update", field, update_field)]
        
        #---------------------start of threads--------------------------------------------------
        threads=[]
        for arg in arguments:
            thread = threading.Thread(target=call_dowellconnection,args=(arg))
            thread.start()
            threads.append(thread)
        for thread in threads:
            thread.join()
        #---------------------end of threads--------------------------------------------------

        """Response block"""
        error ='Thread Execution failed'
        if (not thread.is_alive() for thread in threads):
            error =json.loads(c_r[0])
            if json.loads(c_r[0])["isSuccess"] == True:
                return  Response(success=True, message=success_message, response=json.loads(c_r[0]),status=status.HTTP_201_CREATED)   
        return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
        
@method_decorator(csrf_exempt, name="dispatch")
class accounts_reject_candidate(APIView):
    def post(self, request):
        data = request.data
        error_message = "Rejecting Candidate failed"
        success_message = "Candidate has been Rejected"
        if not data:
            return Response(success=False, message=error_message, response="'request' parameters are not valid, they are None",status=status.HTTP_400_BAD_REQUEST)
            
        serializer = RejectSerializer(data=data)
        if not serializer.is_valid():
            error = {field_name: field_errors[0] if isinstance(field_errors, list) else [field_errors] for field_name, field_errors in serializer.errors.items()}
            return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)

        field = {
            "_id": data.get("document_id"),
        }
        update_field = {
            "reject_remarks": data.get("reject_remarks"),
            "status": "Rejected",
            "rejected_on": data.get("rejected_on"),
            "data_type": data.get("data_type"),
        }
        insert_to_account_report = {
            "company_id": data.get("company_id"),
            "applicant": data.get("applicant"),
            "username": data.get("username"),
            "reject_remarks": data.get("reject_remarks"),
            "status": "Rejected",
            "data_type": data.get("data_type"),
            "rejected_on": data.get("rejected_on"),
        }

        """using threads for concurrency"""
        #---------------------defining thread functions and variables--------------------------------------------------
        c_r = []
        a_r = []
        l_r = []
        h_r = []

        def call_dowellconnection(*args):
            d = dowellconnection(*args)
            if "candidate_report" in args:
                c_r.append(d)
            if "account_report" in args:
                a_r.append(d)
            if  "lead_report" in args:
                l_r.append(d)
            if  "hr_report" in args:
                h_r.append(d)

        arguments = [(*candidate_management_reports, "update", field, update_field),
                     (*hr_management_reports, "update", field, update_field),
                     (*lead_management_reports, "update", field, update_field),
                     (*account_management_reports,"insert",insert_to_account_report,update_field,)]
        
        #---------------------start of threads--------------------------------------------------
        threads=[]
        for arg in arguments:
            thread = threading.Thread(target=call_dowellconnection,args=(arg))
            thread.start()
            threads.append(thread)
        for thread in threads:
            thread.join()
        #---------------------end of threads--------------------------------------------------

        """Response block"""
        error ='Thread Execution failed'
        if (not thread.is_alive() for thread in threads):
            error =json.loads(c_r[0])
            if json.loads(c_r[0])["isSuccess"] == True:
                return  Response(success=True, message=success_message, response=json.loads(c_r[0]),status=status.HTTP_201_CREATED)   
        return Response(success=False, message=error_message, response=error,status=status.HTTP_400_BAD_REQUEST)
        
# apis for account management ends here______________________
