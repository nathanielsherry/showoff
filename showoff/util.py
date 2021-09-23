

def overlay_dicts(over, under):
    result = {}
    keys = set(list(under.keys()) + list(over.keys()))
    for key in keys:
        if key in under and key in over:
            #key in both
            if isinstance(over[key], dict) and isinstance(under[key], dict):
                #both are dicts
                result[key] = overlay_dicts(over[key], under[key])
            else:
                #none or only one were dicts, just stick with over's value
                result[key] = over[key]
        elif key in under:
            #key only in under
            result[key] = under[key]
        elif key in over:
            #key only in over
            result[key] = over[key]
    return result

            
