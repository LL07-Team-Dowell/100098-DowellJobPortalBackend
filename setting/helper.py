def update_number(string):
            updated_string = ""
            for char in string:
                if char.isdigit():
                    updated_string += f'C{str(int(char) + 1)}'
            return updated_string

def update_string(string):
            new_str = ""
            for char in string:
                if char=="C":
                    new_str = string.replace("C", "O")
            return new_str