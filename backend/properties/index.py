'''
Business: API для управления объектами недвижимости
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с атрибутами request_id, function_name
Returns: HTTP response dict
'''
import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn, cursor_factory=RealDictCursor)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Agent-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        if method == 'GET':
            query_params = event.get('queryStringParameters') or {}
            
            filters = []
            params = []
            
            if query_params.get('search'):
                search_term = f"%{query_params['search']}%"
                filters.append("(title ILIKE %s OR address ILIKE %s)")
                params.extend([search_term, search_term])
            
            if query_params.get('min_price'):
                filters.append("price >= %s")
                params.append(int(query_params['min_price']))
            
            if query_params.get('max_price'):
                filters.append("price <= %s")
                params.append(int(query_params['max_price']))
            
            if query_params.get('min_area'):
                filters.append("area >= %s")
                params.append(int(query_params['min_area']))
            
            if query_params.get('max_area'):
                filters.append("area <= %s")
                params.append(int(query_params['max_area']))
            
            if query_params.get('rooms'):
                rooms_list = query_params['rooms'].split(',')
                filters.append(f"rooms IN ({','.join(['%s'] * len(rooms_list))})")
                params.extend([int(r) for r in rooms_list])
            
            if query_params.get('districts'):
                districts_list = query_params['districts'].split(',')
                filters.append(f"district IN ({','.join(['%s'] * len(districts_list))})")
                params.extend(districts_list)
            
            where_clause = " AND ".join(filters) if filters else "1=1"
            query = f"SELECT * FROM properties WHERE {where_clause} ORDER BY created_at DESC"
            
            cursor.execute(query, params)
            properties = cursor.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps([dict(p) for p in properties], default=str),
                'isBase64Encoded': False
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            query = '''
                INSERT INTO properties 
                (title, price, address, area, rooms, floor, total_floors, image_url, lat, lng, district, description)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            '''
            
            cursor.execute(query, (
                body_data['title'],
                body_data['price'],
                body_data['address'],
                body_data['area'],
                body_data['rooms'],
                body_data['floor'],
                body_data['total_floors'],
                body_data.get('image_url'),
                body_data['lat'],
                body_data['lng'],
                body_data['district'],
                body_data.get('description', '')
            ))
            
            conn.commit()
            new_property = cursor.fetchone()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(dict(new_property), default=str),
                'isBase64Encoded': False
            }
        
        if method == 'DELETE':
            path_params = event.get('pathParameters') or {}
            property_id = path_params.get('id')
            
            if not property_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Property ID required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute('DELETE FROM properties WHERE id = %s RETURNING id', (property_id,))
            deleted = cursor.fetchone()
            conn.commit()
            
            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Property not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()
