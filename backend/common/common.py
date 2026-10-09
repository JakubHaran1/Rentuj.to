def create_path(instance, filename):
    """Create path for imgs"""
    return (
        f"{instance._meta.app_label}/"
        f"{instance._meta.model_name}/"
        f"{instance.pk}/"
        f"{filename}"
    )