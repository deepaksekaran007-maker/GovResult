from datetime import datetime, date
from typing import Tuple

def parse_date_safely(date_str: str) -> date:
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except Exception:
        try:
            return datetime.strptime(date_str, "%d-%m-%Y").date()
        except Exception:
            # fallback
            return date.today()

def calculate_deadline_metrics(deadline_date_str: str, start_date_str: str = None) -> Tuple[int, str]:
    """
    Computes days remaining and active status:
    - CLOSING_SOON: 0 <= days <= 7
    - OPEN: days > 7 (and started)
    - UPCOMING: start_date > today
    - CLOSED: days < 0
    """
    today = date.today()
    dl_date = parse_date_safely(deadline_date_str)
    
    delta = (dl_date - today).days
    
    if start_date_str:
        st_date = parse_date_safely(start_date_str)
        if today < st_date:
            return delta, "UPCOMING"
            
    if delta < 0:
        return delta, "CLOSED"
    elif delta <= 7:
        return delta, "CLOSING_SOON"
    else:
        return delta, "OPEN"
