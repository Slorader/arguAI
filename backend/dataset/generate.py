import openai
import json
import os
from tqdm import tqdm

openai.api_key = "sk-proj-ZuVYgNf8OLb3Cd0fZMowT3BlbkFJNtkVQRRbzOf4ULxsWKt0"

folder_path = './sadface-argsme'

if os.path.exists('./response.json'):
    with open('./response.json', 'r') as f:
        responses = json.load(f)
else:
    responses = []

contentCrashed = 0

iteration_counter = 0

total_iterations = 100

start_index = 730

systemeContent = """
You are an intelligent assistant who helps to classify elements in structured debates. Your task is to receive a JSON object containing "nodes" and "edges", classify each node as "premise", "sub-conclusion", "conclusion", etc., and classify the relationships between nodes as "conflict" or "support". You must return only the node IDs and their types, as well as the types of relationships between nodes specified in "edges". Return only the following information in JSON format:
You can't have in the nodes section a "type": "atom" !!! 
In the edge section, the type for each relation must be support or conflict, nothing else !
{
    "nodes": [
        {"id": "node_id_1", "type": "node_type_1"},
        {"id": "node_id_2", "type": "node_type_2"},
        ...
    ],
    "edges": [
        {"source_id": "source_node_id_1", "target_id": "target_node_id_1", "type": "relation_type_1"},
        {"source_id": "source_node_id_2", "target_id": "target_node_id_2", "type": "relation_type_2"},
        ...
    ]
}
"""

def process_file(file_path, index):
    global contentCrashed
    with open(file_path, 'r') as f:
        json_content = json.load(f)

    json_content.pop('metadata', None)
    json_content.pop('resources', None)

    json_content_string = json.dumps(json_content)
    json_content_string = f"{json_content_string}\nUniqueID: {index}"

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-1106",
            messages=[
                {"role": "system", "content": systemeContent},
                {"role": "user", "content": json_content_string}
            ],
            max_tokens=4096
        )
        response_text = response['choices'][0]['message']['content']
        print(response_text)
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]

        response_json = json.loads(response_text)
    except openai.error.InvalidRequestError as e:
        print(f"API request error for file: {file_path}, Error: {str(e)}")
        contentCrashed += 1
        return None
    except Exception as e:
        print(f"Unexpected error for file: {file_path}, Error: {str(e)}")
        contentCrashed += 1
        return None

    nodes_dict = {node['id']: node['type'] for node in response_json['nodes']}
    for node in json_content['nodes']:
        node.pop('metadata', None)
        node_id = node['id']
        if node_id in nodes_dict:
            node['type'] = nodes_dict[node_id]

    edges_dict = {(edge['source_id'], edge['target_id']): edge['type'] for edge in response_json['edges']}
    for edge in json_content['edges']:
        edge_key = (edge['source_id'], edge['target_id'])
        if edge_key in edges_dict:
            edge['type'] = edges_dict[edge_key]

    return json_content



def compter_json(file_name):
    nombre_json = 0

    with open(file_name, 'r') as file:
        data = json.load(file)

        count = len(data)

    return count


for index, filename in tqdm(enumerate(os.listdir(folder_path)), desc="Processing files"):
    if filename.endswith('.json') and index >= start_index:
        file_path = os.path.join(folder_path, filename)
        processed_data = process_file(file_path, index)
        if processed_data is not None:
            responses.append(processed_data)
            iteration_counter += 1
            print(iteration_counter)

        if iteration_counter % 100 == 0 or iteration_counter == total_iterations:
            with open('./response.json', 'w') as f:
                json.dump(responses, f, indent=4)

        if iteration_counter >= total_iterations:
            break

with open('./response.json', 'w') as f:
    json.dump(responses, f, indent=4)

print(f"Processing completed with {contentCrashed} crashes.")
folder_name = "response.json"
total_json_account = compter_json(folder_name)
print("Number of data in the dataset", total_json_account)
