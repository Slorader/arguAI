import json

# Chemin vers le fichier JSON contenant les données du graphe
json_file_path = "data/dataset.json"

# Fonction pour charger les données JSON à partir du fichier
def load_data_from_json(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    return data

# Charger les données du fichier JSON
graph_data = load_data_from_json(json_file_path)

# Extraire les nœuds et les arêtes du graphe
nodes = graph_data["nodes"]
edges = graph_data["edges"]

# Afficher les nœuds et les arêtes pour vérification
print("Nodes:")
for node in nodes:
    print(node)
print("\nEdges:")
for edge in edges:
    print(edge)
