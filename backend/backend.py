import psycopg2

from typing import List
from dataclasses import dataclass
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@dataclass
class Tile:
    id: int
    latitude: float
    longitude: float
    groceriesScore: float
    transportationScore: float
    parkingLotScore: float
    barScore: float
    restaurantScore: float


@dataclass
class Node:
    id: int
    tilesId: int
    type: str
    distance: float
    nodeId: int


def connect_db() -> psycopg2.extensions.connection:
    return psycopg2.connect(
        "host=echo.db.elephantsql.com dbname=qihzwdtc user=qihzwdtc password=e7GD_QPvwJbnzYDPgxJcOorvVtxecSq8")


def get_all_tiles() -> List[Tile]:
    conn = None
    tiles = []

    try:
        conn = connect_db()
        cur = conn.cursor()
        cur.execute("SELECT * FROM tiles")
        print(f"Fetched {cur.rowcount} tiles.")
        rows = cur.fetchall()
        # reorder columns
        tiles = [
            Tile(row[0], row[1], row[2], row[4], row[7], row[5], row[3],
                 row[6]) for row in rows
        ]
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print("Query error: ", error)
    finally:
        if conn is not None:
            conn.close()
        return tiles


def get_all_nodes_from_tilesId(tilesId) -> List[Node]:
    conn = None
    nodes = []

    try:
        conn = connect_db()
        cur = conn.cursor()
        cur.execute("SELECT * FROM nodes WHERE tileId = (%s)", (tilesId,))
        print(f"Fetched {cur.rowcount} nodes.")
        rows = cur.fetchall()
        nodes = [Node(*row) for row in rows]
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print("Query error: ", error)
    finally:
        if conn is not None:
            conn.close()
        return nodes


@app.route('/api/tiles', methods=['GET'])
def return_tiles():
    tiles = get_all_tiles()
    return jsonify(tiles)


@app.route('/api/types', methods=['GET'])
def return_nodes():
    tilesId = int(request.args.get('tilesId', ''))
    nodes = get_all_nodes_from_tilesId(tilesId)
    return jsonify(nodes)
